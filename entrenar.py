"""Entrena, calibra y evalua el unico modelo entregable del hackathon.

Este es el archivo que se debe abrir para exhibir el entrenamiento. El flujo es:
datos -> TF-IDF -> comparacion de algoritmos -> regresion logistica ->
calibracion de confianza -> evaluacion final -> PKL y reportes JSON.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


RAIZ = Path(__file__).resolve().parent
PYTHON_PROYECTO = RAIZ / ".venv_hackathon" / "Scripts" / "python.exe"


def _usar_entorno_del_proyecto() -> None:
    """Permite entrenar con el boton Run aunque VS Code abra otro Python."""

    if PYTHON_PROYECTO.exists() and Path(sys.executable).resolve() != PYTHON_PROYECTO.resolve():
        entorno = os.environ.copy()
        entorno.pop("PYTHONHOME", None)
        entorno.pop("PYTHONPATH", None)
        entorno.pop("VIRTUAL_ENV", None)
        entorno["VIRTUAL_ENV"] = str(PYTHON_PROYECTO.parent.parent)
        proceso = subprocess.run(
            [str(PYTHON_PROYECTO), str(Path(__file__).resolve())],
            cwd=RAIZ,
            env=entorno,
            check=False,
        )
        raise SystemExit(proceso.returncode)


_usar_entorno_del_proyecto()

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    log_loss,
)
from sklearn.model_selection import StratifiedGroupKFold, cross_validate
from sklearn.naive_bayes import ComplementNB
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from clasificador import ClasificadorGastos, normalizar_texto
from clasificador.datos import (
    CATEGORIAS,
    cargar_csv_etiquetado,
    cargar_datos_entrenamiento,
    cargar_datos_entrenamiento_ampliado,
    validar_separacion_splits,
)
from clasificador.modelo import crear_caracteristicas, crear_estimador_base


DATOS_ENTRENAMIENTO = RAIZ / "datos" / "entrenamiento.csv"
DATOS_VALIDACION = RAIZ / "datos" / "validacion.csv"
DATOS_HOLDOUT = RAIZ / "datos" / "holdout_final.csv"
MODELO = RAIZ / "modelos" / "clasificador_gastos.pkl"
RESUMEN = RAIZ / "resultados" / "resumen_entrenamiento.json"
COMPARACION = RAIZ / "resultados" / "comparacion_modelos.json"
EVALUACION = RAIZ / "resultados" / "evaluacion_final.json"
PREDICCIONES = RAIZ / "resultados" / "predicciones_holdout.json"
OBJETIVO_EJEMPLOS = 100_000


def comparar_familias_modelos(df: pd.DataFrame) -> list[dict[str, object]]:
    """Compara alternativas del curso con separacion por concepto."""

    candidatos = {
        "Regresion logistica": LogisticRegression(
            C=3.0,
            class_weight="balanced",
            max_iter=4_000,
            solver="lbfgs",
            random_state=42,
        ),
        "SVM lineal": LinearSVC(
            C=0.5,
            class_weight="balanced",
            dual="auto",
            random_state=42,
        ),
        "SGD logistico": SGDClassifier(
            loss="log_loss",
            alpha=1e-5,
            class_weight="balanced",
            max_iter=2_000,
            random_state=42,
        ),
        "Naive Bayes complementario": ComplementNB(alpha=0.4),
        "Bosque aleatorio": Pipeline(
            [
                ("seleccion_chi2", SelectKBest(chi2, k=5_000)),
                (
                    "bosque",
                    RandomForestClassifier(
                        n_estimators=150,
                        max_depth=40,
                        min_samples_leaf=2,
                        class_weight="balanced_subsample",
                        n_jobs=-1,
                        random_state=42,
                    ),
                ),
            ]
        ),
    }
    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    ranking: list[dict[str, object]] = []
    for nombre, clasificador in candidatos.items():
        pipeline = Pipeline(
            [
                ("caracteristicas", crear_caracteristicas()),
                ("clasificador", clasificador),
            ]
        )
        metricas = cross_validate(
            pipeline,
            df["descripcion"],
            df["categoria"],
            groups=df["grupo"],
            cv=cv,
            scoring={"f1_macro": "f1_macro", "exactitud": "accuracy"},
            n_jobs=-1,
            error_score="raise",
        )
        ranking.append(
            {
                "modelo": nombre,
                "f1_macro_promedio": round(float(metricas["test_f1_macro"].mean()), 4),
                "f1_macro_desviacion": round(float(metricas["test_f1_macro"].std()), 4),
                "exactitud_promedio": round(float(metricas["test_exactitud"].mean()), 4),
                "segundos_fit_promedio": round(float(metricas["fit_time"].mean()), 3),
            }
        )
    ranking.sort(key=lambda fila: float(fila["f1_macro_promedio"]), reverse=True)
    return ranking


def seleccionar_regularizacion(df: pd.DataFrame) -> tuple[float, list[dict[str, float]]]:
    """Ajusta C sin permitir que variantes del mismo concepto crucen folds."""

    cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    resultados: list[dict[str, float]] = []
    for c_regularizacion in (0.75, 1.5, 3.0, 6.0):
        metricas = cross_validate(
            crear_estimador_base(c_regularizacion),
            df["descripcion"],
            df["categoria"],
            groups=df["grupo"],
            cv=cv,
            scoring={"f1_macro": "f1_macro", "exactitud": "accuracy"},
            n_jobs=-1,
            error_score="raise",
        )
        resultados.append(
            {
                "c_regularizacion": c_regularizacion,
                "f1_macro_media": round(float(metricas["test_f1_macro"].mean()), 4),
                "f1_macro_desviacion": round(float(metricas["test_f1_macro"].std()), 4),
                "exactitud_media": round(float(metricas["test_exactitud"].mean()), 4),
            }
        )
    mejor = max(
        resultados,
        key=lambda fila: (
            fila["f1_macro_media"],
            -fila["f1_macro_desviacion"],
            -fila["c_regularizacion"],
        ),
    )
    return float(mejor["c_regularizacion"]), resultados


def metricas_probabilisticas(
    modelo: ClasificadorGastos, textos, categorias
) -> dict[str, float]:
    probabilidades = modelo.predecir_probabilidades(textos)
    clases = modelo.modelo.classes_
    verdaderas = np.asarray(categorias)
    indices = {categoria: indice for indice, categoria in enumerate(clases)}
    one_hot = np.zeros_like(probabilidades)
    for fila, categoria in enumerate(verdaderas):
        one_hot[fila, indices[categoria]] = 1.0

    confianza = probabilidades.max(axis=1)
    predichas = clases[probabilidades.argmax(axis=1)]
    correctas = predichas == verdaderas
    ece = 0.0
    limites = np.linspace(0.0, 1.0, 11)
    for inferior, superior in zip(limites[:-1], limites[1:]):
        mascara = (confianza > inferior) & (confianza <= superior)
        if mascara.any():
            ece += float(mascara.mean()) * abs(
                float(correctas[mascara].mean()) - float(confianza[mascara].mean())
            )
    return {
        "log_loss": float(log_loss(verdaderas, probabilidades, labels=clases)),
        "brier_multiclase": float(np.mean(np.sum((probabilidades - one_hot) ** 2, axis=1))),
        "ece_top": ece,
    }


def seleccionar_temperatura(
    modelo: ClasificadorGastos, validacion: pd.DataFrame
) -> tuple[float, list[dict[str, float]]]:
    """Calibra la confiabilidad en datos que no participaron en el ajuste."""

    resultados: list[dict[str, float]] = []
    for temperatura in np.arange(0.35, 2.001, 0.05):
        modelo.actualizar_temperatura(round(float(temperatura), 2))
        metricas = metricas_probabilisticas(
            modelo, validacion["descripcion"], validacion["categoria"]
        )
        resultados.append(
            {
                "temperatura": round(float(temperatura), 2),
                "log_loss": round(metricas["log_loss"], 4),
                "brier_multiclase": round(metricas["brier_multiclase"], 4),
                "ece_top": round(metricas["ece_top"], 4),
            }
        )
    mejor = min(
        resultados,
        key=lambda fila: (fila["log_loss"], fila["brier_multiclase"], fila["ece_top"]),
    )
    modelo.actualizar_temperatura(float(mejor["temperatura"]))
    return float(mejor["temperatura"]), resultados


def seleccionar_umbral(
    modelo: ClasificadorGastos,
    validacion: pd.DataFrame,
    precision_objetivo: float = 0.93,
) -> tuple[float, list[dict[str, float]]]:
    """Maximiza cobertura con al menos 93% de precision entre aceptadas."""

    detalles = modelo.predecir_lote(validacion["descripcion"], umbral=0.0)
    verdaderas = validacion["categoria"].to_numpy()
    curva: list[dict[str, float]] = []
    for umbral in np.arange(0.35, 0.861, 0.01):
        aceptadas = np.asarray(
            [
                float(item["confianza"]) >= umbral
                and float(item["margen"]) >= modelo.configuracion.margen_minimo
                and float(item["cobertura_lexica"]) >= modelo.configuracion.cobertura_minima
                for item in detalles
            ],
            dtype=bool,
        )
        predichas = np.asarray([item["categoria_modelo"] for item in detalles])
        precision = (
            float(np.mean(predichas[aceptadas] == verdaderas[aceptadas]))
            if aceptadas.any()
            else 1.0
        )
        curva.append(
            {
                "umbral": round(float(umbral), 2),
                "precision_aceptadas": round(precision, 4),
                "cobertura": round(float(aceptadas.mean()), 4),
            }
        )
    candidatos = [
        fila
        for fila in curva
        if fila["precision_aceptadas"] >= precision_objetivo and fila["cobertura"] >= 0.60
    ]
    mejor = max(
        candidatos or curva,
        key=lambda fila: (fila["cobertura"], fila["precision_aceptadas"], -fila["umbral"]),
    )
    modelo.actualizar_umbral(float(mejor["umbral"]))
    return float(mejor["umbral"]), curva


def evaluar_holdout(
    modelo: ClasificadorGastos, holdout: pd.DataFrame
) -> tuple[dict[str, object], dict[str, object]]:
    """Mide una sola vez sobre el conjunto final nunca usado para decidir."""

    detalles = modelo.predecir_lote(holdout["descripcion"])
    salida = pd.DataFrame(detalles)
    salida.insert(1, "categoria_real", holdout["categoria"].to_numpy())
    salida["correcta_final"] = salida["categoria"] == salida["categoria_real"]
    salida["correcta_modelo"] = salida["categoria_modelo"] == salida["categoria_real"]

    y_real = salida["categoria_real"].to_numpy()
    y_final = salida["categoria"].to_numpy()
    y_modelo = salida["categoria_modelo"].to_numpy()
    aceptadas = salida["aceptada"].astype(bool).to_numpy()
    probabilisticas = metricas_probabilisticas(modelo, holdout["descripcion"], y_real)
    precision_aceptadas = (
        float(np.mean(y_modelo[aceptadas] == y_real[aceptadas])) if aceptadas.any() else 1.0
    )
    etiquetas = list(CATEGORIAS)
    reporte: dict[str, object] = {
        "numero_casos": len(salida),
        "nota": "El holdout no se uso para elegir algoritmo, C, temperatura ni umbral.",
        "metricas_modelo_sin_rechazo": {
            "exactitud": round(float(accuracy_score(y_real, y_modelo)), 4),
            "f1_macro": round(float(f1_score(y_real, y_modelo, average="macro")), 4),
            **{clave: round(valor, 4) for clave, valor in probabilisticas.items()},
        },
        "metricas_politica_confianza": {
            "exactitud_final": round(float(accuracy_score(y_real, y_final)), 4),
            "f1_macro_final": round(float(f1_score(y_real, y_final, average="macro")), 4),
            "cobertura_automatica": round(float(aceptadas.mean()), 4),
            "precision_entre_aceptadas": round(precision_aceptadas, 4),
            "casos_rechazados": int((~aceptadas).sum()),
        },
        "reporte_por_categoria_final": classification_report(
            y_real, y_final, labels=etiquetas, output_dict=True, zero_division=0
        ),
        "etiquetas_matriz": etiquetas,
        "matriz_confusion_final": confusion_matrix(
            y_real, y_final, labels=etiquetas
        ).tolist(),
        "metadatos_modelo": modelo.metadatos,
    }
    return reporte, {"predicciones": salida.to_dict(orient="records")}


def escribir_json(ruta: Path, contenido: object) -> None:
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(json.dumps(contenido, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    print("1/6 Cargando particiones y comprobando fugas...")
    compacto = cargar_datos_entrenamiento(DATOS_ENTRENAMIENTO)
    validacion = cargar_csv_etiquetado(DATOS_VALIDACION)
    holdout = cargar_csv_etiquetado(DATOS_HOLDOUT)
    validar_separacion_splits(compacto, validacion, holdout)

    print("2/6 Comparando familias con validacion cruzada agrupada...")
    ranking = comparar_familias_modelos(compacto)
    escribir_json(
        COMPARACION,
        {
            "metodologia": {
                "validacion": "StratifiedGroupKFold de 5 folds",
                "muestras_de_seleccion": len(compacto),
                "grupos_semanticos": int(compacto["grupo"].nunique()),
                "metrica_principal": "F1 macro",
                "regla_de_decision": (
                    "Se prefiere regresion logistica si queda a menos de 1 punto "
                    "de la mejor, porque entrega probabilidad nativa y un PKL mas simple."
                ),
            },
            "ranking": ranking,
        },
    )
    mejor_f1 = float(ranking[0]["f1_macro_promedio"])
    logistica = next(fila for fila in ranking if fila["modelo"] == "Regresion logistica")
    if mejor_f1 - float(logistica["f1_macro_promedio"]) > 0.01:
        raise RuntimeError("Otra familia supera a logistica por mas de un punto; revisar seleccion")

    print("3/6 Ajustando regularizacion y generando exactamente 100 000 ejemplos...")
    c_elegido, resultados_c = seleccionar_regularizacion(compacto)
    entrenamiento = cargar_datos_entrenamiento_ampliado(
        DATOS_ENTRENAMIENTO, objetivo_total=OBJETIVO_EJEMPLOS
    )
    validar_separacion_splits(entrenamiento, validacion, holdout)

    print("4/6 Entrenando regresion logistica multiclase...")
    modelo = ClasificadorGastos(
        umbral_confianza=0.0,
        margen_minimo=0.08,
        cobertura_minima=0.20,
        c_regularizacion=c_elegido,
    ).entrenar(entrenamiento["descripcion"], entrenamiento["categoria"])

    print("5/6 Calibrando confiabilidad y politica de rechazo...")
    temperatura, curva_temperatura = seleccionar_temperatura(modelo, validacion)
    umbral, curva_umbral = seleccionar_umbral(modelo, validacion)
    modelo.metadatos.update(
        {
            "datos": {
                "total_entrenamiento": len(entrenamiento),
                "manuales_curados": int((entrenamiento["fuente"] == "manual_curada").sum()),
                "aumentados_reproducibles": int(
                    (entrenamiento["fuente"] == "aumentacion_sintetica_reproducible").sum()
                ),
                "descripciones_unicas": int(entrenamiento["descripcion_normalizada"].nunique()),
                "distribucion_categorias": {
                    clave: int(valor)
                    for clave, valor in entrenamiento["categoria"].value_counts().sort_index().items()
                },
                "advertencia": (
                    "La aumentacion sintetica mejora invariancia de redaccion, pero no equivale "
                    "a 100 000 transacciones reales independientes."
                ),
            },
            "seleccion_modelo": {
                "comparacion": str(COMPARACION.relative_to(RAIZ)),
                "familia_elegida": "Regresion logistica",
                "razon": (
                    "Mejor F1 macro o diferencia menor a 1 punto frente al mejor; "
                    "probabilidad nativa y despliegue mas simple que SVM calibrada."
                ),
                "regularizacion": resultados_c,
                "c_elegido": c_elegido,
            },
            "calibracion": {
                "dataset": DATOS_VALIDACION.name,
                "metodo": "temperature_scaling",
                "temperatura": temperatura,
            },
            "politica_confianza": {
                "dataset": DATOS_VALIDACION.name,
                "umbral": umbral,
                "precision_objetivo": 0.93,
            },
        }
    )
    modelo.guardar(MODELO)

    print("6/6 Evaluando holdout y escribiendo exclusivamente reportes JSON...")
    evaluacion, predicciones = evaluar_holdout(modelo, holdout)
    escribir_json(EVALUACION, evaluacion)
    escribir_json(PREDICCIONES, predicciones)
    escribir_json(
        RESUMEN,
        {
            "archivo_modelo": str(MODELO.relative_to(RAIZ)),
            "checksum": str(MODELO.with_suffix(".pkl.sha256").relative_to(RAIZ)),
            "ejemplos_entrenamiento": len(entrenamiento),
            "categorias": list(CATEGORIAS),
            "familia_elegida": "Regresion logistica multiclase",
            "c_elegido": c_elegido,
            "temperatura_elegida": temperatura,
            "umbral_elegido": umbral,
            "regularizacion": resultados_c,
            "curva_temperatura": curva_temperatura,
            "curva_umbral": curva_umbral,
            "metricas_holdout": evaluacion["metricas_modelo_sin_rechazo"],
            "metricas_politica_confianza": evaluacion["metricas_politica_confianza"],
            "metadatos_modelo": modelo.metadatos,
        },
    )

    metricas = evaluacion["metricas_modelo_sin_rechazo"]
    politica = evaluacion["metricas_politica_confianza"]
    print("\nENTRENAMIENTO COMPLETADO")
    print(f"Ejemplos: {len(entrenamiento):,}")
    print(f"Modelo: Regresion logistica multiclase (C={c_elegido:g})")
    print(f"Exactitud holdout: {metricas['exactitud']:.1%}")
    print(f"F1 macro holdout: {metricas['f1_macro']:.1%}")
    print(f"Precision aceptada: {politica['precision_entre_aceptadas']:.1%}")
    print(f"PKL: {MODELO}")


if __name__ == "__main__":
    main()
