"""Modelo ML, calibracion, serializacion PKL y politica de confianza."""

from __future__ import annotations

import hashlib
import hmac
import os
import pickle
import platform
import warnings
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import numpy as np
import sklearn
from scipy.sparse import csr_matrix
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.svm import LinearSVC

from .datos import (
    CATEGORIAS,
    PREFIJOS_AUMENTACION_GASTO,
    PREFIJOS_AUMENTACION_INGRESO,
    SENALES_LEXICAS_POR_CATEGORIA,
    SUFIJOS_AUMENTACION,
    TERMINOS_POR_CATEGORIA,
)
from .texto import normalizar_texto, tokens_informativos


VERSION_ARTEFACTO = "3.3.0"


@dataclass(frozen=True)
class ConfiguracionDecision:
    """Controles posteriores al ML para evitar decisiones inseguras."""

    umbral_confianza: float = 0.55
    margen_minimo: float = 0.08
    cobertura_minima: float = 0.20
    categoria_respaldo: str = "Otros"


def _construir_anclas_unicas() -> tuple[tuple[str, ...], dict[str, int]]:
    """Construye el indice desde un vocabulario fuerte revisado manualmente."""

    categorias = tuple(sorted(SENALES_LEXICAS_POR_CATEGORIA))
    anclas: dict[str, int] = {}
    for categoria, terminos in SENALES_LEXICAS_POR_CATEGORIA.items():
        for termino in terminos:
            token = normalizar_texto(termino)
            if " " in token:
                raise ValueError(f"La señal lexica debe ser un token: {termino}")
            if token in anclas:
                raise ValueError(f"La señal lexica esta duplicada: {termino}")
            anclas[token] = categorias.index(categoria)
    return categorias, anclas


_CATEGORIAS_ANCLAS, _ANCLAS_UNICAS = _construir_anclas_unicas()


def _construir_indice_aproximado() -> dict[str, frozenset[tuple[str, int]]]:
    """Indexa firmas a una edición de distancia para corregir errores simples.

    La firma por eliminación permite detectar, sin una búsqueda costosa, una
    letra omitida, agregada, sustituida o dos letras adyacentes intercambiadas.
    Solo se usan anclas de al menos cinco caracteres y una coincidencia se
    acepta cuando todas las alternativas apuntan a la misma categoría.
    """

    firmas: dict[str, set[tuple[str, int]]] = {}
    for ancla, indice_categoria in _ANCLAS_UNICAS.items():
        if len(ancla) < 5:
            continue
        for indice in range(len(ancla)):
            firma = ancla[:indice] + ancla[indice + 1 :]
            firmas.setdefault(firma, set()).add((ancla, indice_categoria))
    return {firma: frozenset(anclas) for firma, anclas in firmas.items()}


_FIRMAS_ANCLAS = _construir_indice_aproximado()

# Alias de marcas con dos errores simultáneos frecuentes. La corrección difusa
# general se limita deliberadamente a una edición para no convertir palabras
# válidas y genéricas (por ejemplo, "compra") en conceptos de otra categoría.
_ALIAS_ORTOGRAFICOS: dict[str, str] = {
    "nelfix": "netflix",
    "netflic": "netflix",
    "spotfy": "spotify",
    "spootify": "spotify",
    "farmasya": "farmacia",
}
_ANCLAS_CORTAS_EMBEBIBLES = frozenset({"afp", "etf", "hbo"})
_ANCLAS_EMBEBIBLES = tuple(
    (ancla, categoria)
    for ancla, categoria in _ANCLAS_UNICAS.items()
    if len(ancla) >= 5 or ancla in _ANCLAS_CORTAS_EMBEBIBLES
)
_VOCABULARIO_LIMPIO = {
    token
    for texto in (
        *(termino for terminos in TERMINOS_POR_CATEGORIA.values() for termino in terminos),
        *PREFIJOS_AUMENTACION_GASTO,
        *PREFIJOS_AUMENTACION_INGRESO,
        *SUFIJOS_AUMENTACION,
    )
    for token in normalizar_texto(texto).split()
}
_TECLAS_VECINAS = {
    frozenset(par)
    for par in (
        "as", "er", "io", "op", "uy", "rt", "nm", "lk", "cv", "df",
        "ty", "gh", "qw", "we", "sd", "fg", "hj", "jk", "zx", "xc",
    )
}
_CAMBIOS_FONETICOS = {
    frozenset(par) for par in ("bv", "cs", "sz", "kc", "ky", "iy")
}


def _es_una_edicion_admitida(token: str, ancla: str) -> bool:
    """Valida una edición real y rechaza coincidencias de firma accidentales."""

    diferencia_longitud = len(token) - len(ancla)
    if abs(diferencia_longitud) > 1:
        return False
    if diferencia_longitud == 0:
        diferentes = [
            indice for indice, (actual, esperado) in enumerate(zip(token, ancla))
            if actual != esperado
        ]
        if len(diferentes) == 1:
            indice = diferentes[0]
            cambio = frozenset((token[indice], ancla[indice]))
            return cambio in _TECLAS_VECINAS or cambio in _CAMBIOS_FONETICOS
        if len(diferentes) == 2:
            primero, segundo = diferentes
            return (
                segundo == primero + 1
                and token[primero] == ancla[segundo]
                and token[segundo] == ancla[primero]
            )
        return False

    corta, larga = (token, ancla) if diferencia_longitud < 0 else (ancla, token)
    indice_corta = indice_larga = diferencias = 0
    while indice_corta < len(corta) and indice_larga < len(larga):
        if corta[indice_corta] == larga[indice_larga]:
            indice_corta += 1
            indice_larga += 1
            continue
        diferencias += 1
        indice_larga += 1
        if diferencias > 1:
            return False
    return True


def _ancla_aproximada(token: str) -> tuple[str, int] | None:
    """Busca un ancla inequívoca a una edición Damerau-Levenshtein."""

    alias = _ALIAS_ORTOGRAFICOS.get(token)
    if alias is not None:
        return alias, _ANCLAS_UNICAS[alias]
    if token in _VOCABULARIO_LIMPIO:
        return None
    if len(token) < 4:
        return None

    candidatas: set[tuple[str, int]] = set(_FIRMAS_ANCLAS.get(token, ()))
    for indice in range(len(token)):
        firma = token[:indice] + token[indice + 1 :]
        categoria_exacta = _ANCLAS_UNICAS.get(firma)
        if categoria_exacta is not None and len(firma) >= 5:
            candidatas.add((firma, categoria_exacta))
        candidatas.update(_FIRMAS_ANCLAS.get(firma, ()))

    candidatas = {
        candidata
        for candidata in candidatas
        if _es_una_edicion_admitida(token, candidata[0])
    }

    categorias = {categoria for _, categoria in candidatas}
    if len(categorias) != 1:
        return None
    return min(candidatas, key=lambda item: (abs(len(item[0]) - len(token)), item[0]))


def _categoria_ancla_aproximada(token: str) -> int | None:
    """Devuelve una categoría única si ``token`` está a una edición del ancla."""

    resultado = _ancla_aproximada(token)
    return None if resultado is None else resultado[1]


def _anclas_en_token_unido(token: str) -> tuple[str, ...]:
    """Extrae conceptos incrustados en texto sin espacios si no son ambiguos."""

    if len(token) < 8:
        return ()
    encontradas = {
        (ancla, categoria)
        for ancla, categoria in _ANCLAS_EMBEBIBLES
        if len(token) >= len(ancla) + 3
        and ancla in token
        and (
            len(ancla) >= 5
            or token.startswith(ancla)
            or token.endswith(ancla)
        )
    }
    categorias = {categoria for _, categoria in encontradas}
    if len(categorias) != 1:
        return ()
    return tuple(sorted({ancla for ancla, _ in encontradas}, key=lambda x: (-len(x), x)))


def normalizar_texto_modelo(texto: object) -> str:
    """Normaliza y corrige como máximo un error cuando el ancla es inequívoca."""

    normalizado = normalizar_texto(texto)
    corregidos: list[str] = []
    for token in normalizado.split():
        if token in _ANCLAS_UNICAS:
            corregidos.append(token)
            continue
        resultado = _ancla_aproximada(token)
        if resultado is not None:
            corregidos.append(resultado[0])
            continue
        embebidas = _anclas_en_token_unido(token)
        corregidos.extend(embebidas or (token,))
    return " ".join(corregidos)


class SenalesLexicas(BaseEstimator, TransformerMixin):
    """Transforma terminos financieros exclusivos en señales aprendibles.

    Las señales forman parte del vector de entrada del clasificador lineal. No
    reemplazan la prediccion con una cadena de reglas posterior.
    """

    def fit(
        self, X: Iterable[object], y: Iterable[object] | None = None
    ) -> "SenalesLexicas":
        return self

    def transform(self, X: Iterable[object]) -> csr_matrix:
        filas: list[list[float]] = []
        for texto in X:
            puntajes = [0.0] * len(_CATEGORIAS_ANCLAS)
            for token in set(tokens_informativos(normalizar_texto_modelo(texto))):
                indice = _ANCLAS_UNICAS.get(token)
                if indice is not None:
                    puntajes[indice] += 1.0
                    continue
                indice_aproximado = _categoria_ancla_aproximada(token)
                if indice_aproximado is not None:
                    puntajes[indice_aproximado] += 0.75
            filas.append(np.log1p(puntajes).tolist())
        return csr_matrix(np.asarray(filas, dtype=float))


def crear_caracteristicas() -> FeatureUnion:
    """Crea una representacion dispersa apta para descripciones bancarias."""

    return FeatureUnion(
        [
            (
                "palabras",
                TfidfVectorizer(
                    preprocessor=normalizar_texto_modelo,
                    ngram_range=(1, 2),
                    min_df=1,
                    max_df=0.995,
                    sublinear_tf=True,
                ),
            ),
            (
                "caracteres",
                TfidfVectorizer(
                    preprocessor=normalizar_texto_modelo,
                    analyzer="char_wb",
                    ngram_range=(3, 5),
                    min_df=2,
                    sublinear_tf=True,
                    max_features=60_000,
                ),
            ),
            ("lexico_financiero", SenalesLexicas()),
        ],
        transformer_weights={
            "palabras": 1.0,
            "caracteres": 0.8,
            "lexico_financiero": 2.5,
        },
    )


def crear_estimador_base(c_regularizacion: float = 3.0) -> Pipeline:
    """Crea el pipeline final: TF-IDF y regresion logistica multiclase."""

    return Pipeline(
        [
            ("caracteristicas", crear_caracteristicas()),
            (
                "clasificador",
                LogisticRegression(
                    C=float(c_regularizacion),
                    class_weight="balanced",
                    max_iter=4_000,
                    random_state=42,
                    solver="lbfgs",
                ),
            ),
        ]
    )


def crear_estimador_svm(c_regularizacion: float = 0.5) -> Pipeline:
    """Crea una SVM lineal adecuada para vectores TF-IDF de alta dimensión."""

    return Pipeline(
        [
            ("caracteristicas", crear_caracteristicas()),
            (
                "clasificador",
                LinearSVC(
                    C=float(c_regularizacion),
                    class_weight="balanced",
                    dual="auto",
                    random_state=42,
                ),
            ),
        ]
    )


def _hash_dataset(textos: list[str], categorias: list[str]) -> str:
    filas = sorted(f"{categoria}\t{texto}" for texto, categoria in zip(textos, categorias))
    contenido = "\n".join(filas).encode("utf-8")
    return hashlib.sha256(contenido).hexdigest()


class ClasificadorGastos:
    """Clasifica transacciones y explica la confianza de cada decision."""

    def __init__(
        self,
        umbral_confianza: float = 0.55,
        margen_minimo: float = 0.08,
        cobertura_minima: float = 0.20,
        c_regularizacion: float = 0.5,
        algoritmo: str = "svm_lineal",
    ) -> None:
        self.configuracion = ConfiguracionDecision(
            umbral_confianza=float(umbral_confianza),
            margen_minimo=float(margen_minimo),
            cobertura_minima=float(cobertura_minima),
        )
        self.c_regularizacion = float(c_regularizacion)
        if algoritmo not in {"svm_lineal", "regresion_logistica"}:
            raise ValueError("algoritmo debe ser 'svm_lineal' o 'regresion_logistica'")
        self.algoritmo = algoritmo
        self.metodo_calibracion = (
            "sigmoid_grouped_cv+temperature_scaling"
            if algoritmo == "svm_lineal"
            else "temperature_scaling"
        )
        self.temperatura_calibracion = 1.0
        self.modelo: BaseEstimator | None = None
        self.vocabulario_conocido: set[str] = set()
        self.metadatos: dict[str, object] = {}

    def entrenar(
        self,
        textos: Iterable[object],
        categorias: Iterable[object],
        grupos: Iterable[object] | None = None,
    ) -> "ClasificadorGastos":
        textos_lista = [normalizar_texto(x) for x in textos]
        categorias_lista = [str(x).strip() for x in categorias]
        grupos_lista = None if grupos is None else [str(x) for x in grupos]

        if len(textos_lista) != len(categorias_lista):
            raise ValueError("textos y categorias deben tener la misma longitud")
        if grupos_lista is not None and len(grupos_lista) != len(textos_lista):
            raise ValueError("grupos debe tener la misma longitud que textos")
        if not textos_lista or any(not texto for texto in textos_lista):
            raise ValueError("El dataset contiene descripciones vacias")
        if not 0.0 <= self.configuracion.umbral_confianza <= 1.0:
            raise ValueError("El umbral debe estar entre 0 y 1")

        clases, conteos = np.unique(categorias_lista, return_counts=True)
        if set(clases) != set(CATEGORIAS):
            faltantes = sorted(set(CATEGORIAS) - set(clases))
            extras = sorted(set(clases) - set(CATEGORIAS))
            raise ValueError(f"Contrato de categorias invalido; faltan={faltantes}, extras={extras}")
        if min(conteos) < 5:
            raise ValueError("Cada categoria necesita al menos cinco ejemplos")

        if self.algoritmo == "svm_lineal":
            if grupos_lista is None:
                raise ValueError("La SVM calibrada requiere grupos para evitar fuga semantica")
            divisor = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
            folds = list(divisor.split(textos_lista, categorias_lista, grupos_lista))
            self.modelo = CalibratedClassifierCV(
                estimator=crear_estimador_svm(self.c_regularizacion),
                method="sigmoid",
                cv=folds,
                ensemble=False,
                n_jobs=-1,
            )
        else:
            self.modelo = crear_estimador_base(self.c_regularizacion)
        self.modelo.fit(textos_lista, categorias_lista)
        self.vocabulario_conocido = {
            token
            for texto in textos_lista
            for token in tokens_informativos(normalizar_texto_modelo(texto))
        }
        self.metadatos = {
            "version_artefacto": VERSION_ARTEFACTO,
            "creado_utc": datetime.now(timezone.utc).isoformat(),
            "numero_ejemplos": len(textos_lista),
            "categorias": clases.tolist(),
            "configuracion": asdict(self.configuracion),
            "c_regularizacion": self.c_regularizacion,
            "familia_modelo": self.algoritmo,
            "metodo_calibracion": self.metodo_calibracion,
            "temperatura_calibracion": self.temperatura_calibracion,
            "hash_dataset_sha256": _hash_dataset(textos_lista, categorias_lista),
            "algoritmo": (
                "TF-IDF de palabras y caracteres + senales lexicas; "
                "LinearSVC balanceada + calibracion sigmoid agrupada + temperature scaling"
                if self.algoritmo == "svm_lineal"
                else "TF-IDF de palabras y caracteres + senales lexicas; "
                "LogisticRegression multiclase balanceada + temperature scaling"
            ),
            "formato_serializacion": "pickle",
            "python": platform.python_version(),
            "scikit_learn": sklearn.__version__,
            "numpy": np.__version__,
        }
        return self

    def _verificar_entrenado(self) -> BaseEstimator:
        if self.modelo is None:
            raise RuntimeError("El clasificador todavia no fue entrenado")
        return self.modelo

    def cobertura_lexica(self, texto: object) -> float:
        tokens = tokens_informativos(normalizar_texto_modelo(texto))
        if not tokens:
            return 0.0
        conocidos = sum(token in self.vocabulario_conocido for token in tokens)
        return conocidos / len(tokens)

    def actualizar_umbral(self, umbral: float) -> None:
        """Actualiza la politica de aceptacion sin reentrenar los pesos."""

        if not 0.0 <= float(umbral) <= 1.0:
            raise ValueError("El umbral debe estar entre 0 y 1")
        self.configuracion = ConfiguracionDecision(
            umbral_confianza=float(umbral),
            margen_minimo=self.configuracion.margen_minimo,
            cobertura_minima=self.configuracion.cobertura_minima,
            categoria_respaldo=self.configuracion.categoria_respaldo,
        )
        if self.metadatos:
            self.metadatos["configuracion"] = asdict(self.configuracion)

    def actualizar_temperatura(self, temperatura: float) -> None:
        """Ajusta la nitidez de probabilidades usando un split de validacion."""

        temperatura = float(temperatura)
        if not 0.20 <= temperatura <= 5.0:
            raise ValueError("La temperatura debe estar entre 0.20 y 5.0")
        self.temperatura_calibracion = temperatura
        if self.metadatos:
            self.metadatos["temperatura_calibracion"] = temperatura

    def predecir_probabilidades(self, descripciones: Iterable[object]) -> np.ndarray:
        """Devuelve probabilidades calibradas y ajustadas por temperatura."""

        modelo = self._verificar_entrenado()
        textos = [normalizar_texto(texto) for texto in descripciones]
        probabilidades = modelo.predict_proba(textos)
        temperatura = self.temperatura_calibracion
        if temperatura == 1.0:
            return probabilidades
        log_probabilidades = np.log(np.clip(probabilidades, 1e-12, 1.0)) / temperatura
        log_probabilidades -= log_probabilidades.max(axis=1, keepdims=True)
        ajustadas = np.exp(log_probabilidades)
        return ajustadas / ajustadas.sum(axis=1, keepdims=True)

    def predecir(self, descripcion: object, umbral: float | None = None) -> dict[str, object]:
        modelo = self._verificar_entrenado()
        texto = normalizar_texto(descripcion)
        umbral_usado = self.configuracion.umbral_confianza if umbral is None else float(umbral)
        if not 0.0 <= umbral_usado <= 1.0:
            raise ValueError("El umbral debe estar entre 0 y 1")

        if not texto:
            return {
                "descripcion": str(descripcion or ""),
                "categoria": self.configuracion.categoria_respaldo,
                "categoria_modelo": None,
                "confianza": 0.0,
                "confianza_porcentaje": 0.0,
                "margen": 0.0,
                "cobertura_lexica": 0.0,
                "aceptada": False,
                "motivo": "texto_vacio",
                "top_3": [],
                "version_modelo": VERSION_ARTEFACTO,
            }

        probabilidades = self.predecir_probabilidades([texto])[0]
        orden = np.argsort(probabilidades)[::-1]
        clases = modelo.classes_
        indice_1, indice_2 = int(orden[0]), int(orden[1])
        categoria_modelo = str(clases[indice_1])
        confianza = float(probabilidades[indice_1])
        margen = confianza - float(probabilidades[indice_2])
        cobertura = self.cobertura_lexica(texto)

        motivos: list[str] = []
        if confianza < umbral_usado:
            motivos.append("confianza_baja")
        if margen < self.configuracion.margen_minimo:
            motivos.append("prediccion_ambigua")
        if cobertura < self.configuracion.cobertura_minima:
            motivos.append("texto_fuera_de_vocabulario")

        aceptada = not motivos
        categoria_final = categoria_modelo if aceptada else self.configuracion.categoria_respaldo
        top_3 = [
            {
                "categoria": str(clases[int(indice)]),
                "probabilidad": round(float(probabilidades[int(indice)]), 4),
            }
            for indice in orden[:3]
        ]
        return {
            "descripcion": str(descripcion),
            "categoria": categoria_final,
            "categoria_modelo": categoria_modelo,
            "confianza": round(confianza, 4),
            "confianza_porcentaje": round(confianza * 100, 1),
            "margen": round(margen, 4),
            "cobertura_lexica": round(cobertura, 4),
            "aceptada": aceptada,
            "motivo": "aceptada" if aceptada else ",".join(motivos),
            "top_3": top_3,
            "version_modelo": VERSION_ARTEFACTO,
        }

    def predecir_lote(
        self, descripciones: Iterable[object], umbral: float | None = None
    ) -> list[dict[str, object]]:
        return [self.predecir(texto, umbral=umbral) for texto in descripciones]

    def guardar(self, ruta: str | Path) -> Path:
        """Serializa como PKL de forma atomica y escribe un SHA-256 lateral."""

        self._verificar_entrenado()
        destino = Path(ruta)
        if destino.suffix.lower() != ".pkl":
            raise ValueError("El entregable del modelo debe usar extension .pkl")
        destino.parent.mkdir(parents=True, exist_ok=True)
        temporal = destino.with_suffix(destino.suffix + ".tmp")
        try:
            with temporal.open("wb") as archivo:
                pickle.dump(self, archivo, protocol=pickle.HIGHEST_PROTOCOL)
                archivo.flush()
                os.fsync(archivo.fileno())
            os.replace(temporal, destino)
        finally:
            temporal.unlink(missing_ok=True)

        digest = hashlib.sha256(destino.read_bytes()).hexdigest()
        destino.with_suffix(destino.suffix + ".sha256").write_text(
            f"{digest}  {destino.name}\n", encoding="ascii"
        )
        return destino


def _verificar_checksum(ruta: Path) -> None:
    archivo_hash = ruta.with_suffix(ruta.suffix + ".sha256")
    if not archivo_hash.exists():
        warnings.warn(f"No existe checksum para {ruta.name}; no se verifico su integridad")
        return
    esperado = archivo_hash.read_text(encoding="ascii").split()[0].strip().lower()
    actual = hashlib.sha256(ruta.read_bytes()).hexdigest()
    if not hmac.compare_digest(esperado, actual):
        raise ValueError(f"El checksum SHA-256 no coincide para {ruta}")


def cargar_modelo(ruta: str | Path, verificar_integridad: bool = True) -> ClasificadorGastos:
    """Carga un PKL confiable y comprueba tipo, integridad y version principal."""

    origen = Path(ruta)
    if origen.suffix.lower() != ".pkl":
        raise ValueError("Se esperaba un archivo de modelo con extension .pkl")
    if verificar_integridad:
        _verificar_checksum(origen)
    with origen.open("rb") as archivo:
        modelo = pickle.load(archivo)
    if not isinstance(modelo, ClasificadorGastos):
        raise TypeError("El archivo no contiene un ClasificadorGastos valido")
    modelo._verificar_entrenado()

    version = str(modelo.metadatos.get("version_artefacto", "0.0.0"))
    if version != VERSION_ARTEFACTO:
        raise ValueError(
            f"Version de artefacto incompatible: {version}; "
            f"se requiere exactamente {VERSION_ARTEFACTO}"
        )
    version_sklearn = str(modelo.metadatos.get("scikit_learn", ""))
    if version_sklearn and version_sklearn.split(".")[:2] != sklearn.__version__.split(".")[:2]:
        warnings.warn(
            "El modelo fue entrenado con scikit-learn "
            f"{version_sklearn} y se carga con {sklearn.__version__}"
        )
    return modelo
