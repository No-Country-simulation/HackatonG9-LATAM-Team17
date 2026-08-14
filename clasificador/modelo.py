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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion, Pipeline

from .datos import CATEGORIAS, SENALES_LEXICAS_POR_CATEGORIA
from .texto import normalizar_texto, tokens_informativos


VERSION_ARTEFACTO = "3.0.0"


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


class SenalesLexicas(BaseEstimator, TransformerMixin):
    """Transforma terminos financieros exclusivos en señales aprendibles.

    Las señales forman parte del vector de entrada de la regresion logistica. No
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
            for token in set(tokens_informativos(texto)):
                indice = _ANCLAS_UNICAS.get(token)
                if indice is not None:
                    puntajes[indice] += 1.0
            filas.append(np.log1p(puntajes).tolist())
        return csr_matrix(np.asarray(filas, dtype=float))


def crear_caracteristicas() -> FeatureUnion:
    """Crea una representacion dispersa apta para descripciones bancarias."""

    return FeatureUnion(
        [
            (
                "palabras",
                TfidfVectorizer(
                    preprocessor=normalizar_texto,
                    ngram_range=(1, 2),
                    min_df=1,
                    max_df=0.995,
                    sublinear_tf=True,
                ),
            ),
            (
                "caracteres",
                TfidfVectorizer(
                    preprocessor=normalizar_texto,
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
        c_regularizacion: float = 3.0,
    ) -> None:
        self.configuracion = ConfiguracionDecision(
            umbral_confianza=float(umbral_confianza),
            margen_minimo=float(margen_minimo),
            cobertura_minima=float(cobertura_minima),
        )
        self.c_regularizacion = float(c_regularizacion)
        self.metodo_calibracion = "temperature_scaling"
        self.temperatura_calibracion = 1.0
        self.modelo: Pipeline | None = None
        self.vocabulario_conocido: set[str] = set()
        self.metadatos: dict[str, object] = {}

    def entrenar(
        self, textos: Iterable[object], categorias: Iterable[object]
    ) -> "ClasificadorGastos":
        textos_lista = [normalizar_texto(x) for x in textos]
        categorias_lista = [str(x).strip() for x in categorias]

        if len(textos_lista) != len(categorias_lista):
            raise ValueError("textos y categorias deben tener la misma longitud")
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

        self.modelo = crear_estimador_base(self.c_regularizacion)
        self.modelo.fit(textos_lista, categorias_lista)
        self.vocabulario_conocido = {
            token for texto in textos_lista for token in tokens_informativos(texto)
        }
        self.metadatos = {
            "version_artefacto": VERSION_ARTEFACTO,
            "creado_utc": datetime.now(timezone.utc).isoformat(),
            "numero_ejemplos": len(textos_lista),
            "categorias": clases.tolist(),
            "configuracion": asdict(self.configuracion),
            "c_regularizacion": self.c_regularizacion,
            "metodo_calibracion": self.metodo_calibracion,
            "temperatura_calibracion": self.temperatura_calibracion,
            "hash_dataset_sha256": _hash_dataset(textos_lista, categorias_lista),
            "algoritmo": (
                "TF-IDF de palabras y caracteres + senales lexicas; "
                "LogisticRegression multiclase balanceada + temperature scaling"
            ),
            "formato_serializacion": "pickle",
            "python": platform.python_version(),
            "scikit_learn": sklearn.__version__,
            "numpy": np.__version__,
        }
        return self

    def _verificar_entrenado(self) -> Pipeline:
        if self.modelo is None:
            raise RuntimeError("El clasificador todavia no fue entrenado")
        return self.modelo

    def cobertura_lexica(self, texto: object) -> float:
        tokens = tokens_informativos(texto)
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
    if version.split(".")[0] != VERSION_ARTEFACTO.split(".")[0]:
        raise ValueError(f"Version de artefacto incompatible: {version}")
    version_sklearn = str(modelo.metadatos.get("scikit_learn", ""))
    if version_sklearn and version_sklearn.split(".")[:2] != sklearn.__version__.split(".")[:2]:
        warnings.warn(
            "El modelo fue entrenado con scikit-learn "
            f"{version_sklearn} y se carga con {sklearn.__version__}"
        )
    return modelo
