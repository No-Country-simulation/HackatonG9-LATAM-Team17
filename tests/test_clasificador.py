from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path

import pandas as pd
import pytest

from clasificador import cargar_modelo, clasificar_payload, normalizar_texto
from clasificador.datos import (
    CATEGORIAS,
    cargar_csv_etiquetado,
    cargar_datos_entrenamiento_ampliado,
    generar_variantes_ortograficas,
    validar_separacion_splits,
)
from clasificador.modelo import normalizar_texto_modelo


RAIZ = Path(__file__).resolve().parents[1]
RUTA_MODELO = RAIZ / "modelos" / "clasificador_gastos.pkl"


@pytest.fixture(scope="session")
def modelo():
    if not RUTA_MODELO.exists():
        pytest.fail("Falta el entregable PKL; ejecuta primero `python entrenar.py`")
    return cargar_modelo(RUTA_MODELO)


@pytest.fixture(scope="session")
def datos_ampliados():
    return cargar_datos_entrenamiento_ampliado(
        RAIZ / "datos" / "entrenamiento.csv", objetivo_total=100_000
    )


@pytest.fixture(scope="session")
def casos_regresion():
    contenido = json.loads(
        (RAIZ / "datos" / "casos_regresion.json").read_text(encoding="utf-8")
    )
    return contenido["casos"]


@pytest.fixture(scope="session")
def casos_ortograficos_dirigidos():
    contenido = json.loads(
        (RAIZ / "datos" / "casos_regresion.json").read_text(encoding="utf-8")
    )
    return contenido["casos_ortograficos_dirigidos"]


def test_normalizacion_conserva_digitos_y_quita_acentos() -> None:
    assert normalizar_texto("  PAGO Clínico #2026!! ") == "pago clinico 2026"


@pytest.mark.parametrize(
    ("texto", "normalizado"),
    [
        ("spootify", "spotify"),
        ("hipoetca", "hipoteca"),
        ("compradezapatos", "zapatos"),
        ("transferenciaparacomprarETF", "etf"),
        ("serviciodeinternetdelhogar", "serviciodeinternetdelhogar"),
    ],
)
def test_normalizacion_ortografica_es_conservadora(texto, normalizado) -> None:
    assert normalizar_texto_modelo(texto) == normalizado


def test_contrato_incluye_las_doce_categorias() -> None:
    assert len(CATEGORIAS) == 12
    assert "Aporte Inversiones" in CATEGORIAS
    assert "Gastos Hormiga" in CATEGORIAS
    assert "Suscripciones" in CATEGORIAS


def test_dataset_ampliado_tiene_100000_textos_unicos_y_balanceados(datos_ampliados) -> None:
    conteos = datos_ampliados["categoria"].value_counts()
    assert len(datos_ampliados) == 100_000
    assert datos_ampliados["descripcion_normalizada"].nunique() == 100_000
    assert int(conteos.max() - conteos.min()) <= 1


def test_pkl_declara_modelo_y_datos_entrenados(modelo) -> None:
    assert modelo.metadatos["numero_ejemplos"] == 100_000
    assert modelo.metadatos["familia_modelo"] == "svm_lineal"
    assert modelo.algoritmo == "svm_lineal"
    assert modelo.metadatos["datos"]["descripciones_unicas"] == 100_000
    assert modelo.metadatos["version_artefacto"] == "3.3.0"


def test_regresion_semantica_incluye_almuerzo(modelo, casos_regresion) -> None:
    errores = []
    for caso in casos_regresion:
        resultado = modelo.predecir(caso["descripcion"], umbral=0.0)
        if resultado["categoria_modelo"] != caso["categoria_esperada"]:
            errores.append(
                {
                    "descripcion": caso["descripcion"],
                    "esperada": caso["categoria_esperada"],
                    "obtenida": resultado["categoria_modelo"],
                }
            )
    assert not errores, errores

    almuerzo = modelo.predecir("almuerzo", umbral=0.0)
    assert almuerzo["categoria_modelo"] == "Alimentacion"
    assert almuerzo["confianza"] >= 0.90


def test_regresion_resiste_ruido_bancario(modelo, casos_regresion) -> None:
    transformaciones = (
        lambda texto: texto,
        lambda texto: texto.upper(),
        lambda texto: f"PAGO POS {texto} LIMA",
        lambda texto: f"TRX-8842 {texto.replace(' ', '-')} REF",
        lambda texto: f"cargo bancario {texto} operacion confirmada",
    )
    errores = []
    total = 0
    for caso in casos_regresion:
        for transformar in transformaciones:
            total += 1
            descripcion = transformar(caso["descripcion"])
            obtenida = modelo.predecir(descripcion, umbral=0.0)["categoria_modelo"]
            if obtenida != caso["categoria_esperada"]:
                errores.append((descripcion, caso["categoria_esperada"], obtenida))
    exactitud = 1.0 - (len(errores) / total)
    assert exactitud >= 0.99, {"exactitud": exactitud, "errores": errores[:10]}


def test_regresion_resiste_errores_ortograficos(modelo, casos_regresion) -> None:
    errores = []
    total = 0
    for caso in casos_regresion:
        for nombre, descripcion in generar_variantes_ortograficas(
            caso["descripcion"]
        ).items():
            total += 1
            obtenida = modelo.predecir(descripcion, umbral=0.0)["categoria_modelo"]
            if obtenida != caso["categoria_esperada"]:
                errores.append(
                    (nombre, descripcion, caso["categoria_esperada"], obtenida)
                )
    exactitud = 1.0 - (len(errores) / total)
    assert exactitud == 1.0, {"exactitud": exactitud, "errores": errores[:20]}


def test_errores_ortograficos_dirigidos(
    modelo, casos_ortograficos_dirigidos
) -> None:
    errores = []
    for caso in casos_ortograficos_dirigidos:
        resultado = modelo.predecir(caso["descripcion"], umbral=0.0)
        if resultado["categoria_modelo"] != caso["categoria_esperada"]:
            errores.append(
                (
                    caso["descripcion"],
                    caso["categoria_esperada"],
                    resultado["categoria_modelo"],
                )
            )
    assert not errores, errores


def test_resultados_del_modelo_son_json() -> None:
    archivos = [ruta for ruta in (RAIZ / "resultados").iterdir() if ruta.is_file()]
    assert archivos
    assert all(ruta.suffix.lower() == ".json" for ruta in archivos)


def test_splits_no_tienen_fuga_exacta(datos_ampliados) -> None:
    validacion = cargar_csv_etiquetado(RAIZ / "datos" / "validacion.csv")
    holdout = cargar_csv_etiquetado(RAIZ / "datos" / "holdout_final.csv")
    validar_separacion_splits(datos_ampliados, validacion, holdout)


@pytest.mark.parametrize(
    ("texto", "esperada"),
    [
        ("compras del supermercado para cocinar", "Alimentacion"),
        ("aporte mensual a mi cartera de ETF", "Aporte Inversiones"),
        ("pago del curso de programacion", "Educacion"),
        ("cafecito barato de la maquina", "Gastos Hormiga"),
        ("mi empleador deposito el sueldo", "Ingresos"),
        ("entradas para el concierto", "Ocio"),
        ("retiro en cajero automatico", "Otros"),
        ("medicamentos de la farmacia", "Salud"),
        ("factura mensual de internet", "Servicios"),
        ("renovacion mensual de Netflix", "Suscripciones"),
        ("viaje en taxi al trabajo", "Transporte"),
        ("renta mensual del apartamento", "Vivienda"),
    ],
)
def test_categorias_representativas(modelo, texto: str, esperada: str) -> None:
    resultado = modelo.predecir(texto)
    assert resultado["categoria"] == esperada, resultado
    assert resultado["aceptada"] is True, resultado


def test_texto_desconocido_se_rechaza(modelo) -> None:
    resultado = modelo.predecir("zqxw plmn rrvv 9981")
    assert resultado["categoria"] == "Otros"
    assert resultado["aceptada"] is False
    assert "texto_fuera_de_vocabulario" in resultado["motivo"]


def test_texto_vacio_es_seguro(modelo) -> None:
    resultado = modelo.predecir("  ")
    assert resultado["categoria"] == "Otros"
    assert resultado["confianza"] == 0.0
    assert resultado["motivo"] == "texto_vacio"


def test_resultado_expone_confianza_y_trazabilidad(modelo) -> None:
    resultado = modelo.predecir("consulta medica")
    assert 0.0 <= resultado["confianza"] <= 1.0
    assert 0.0 <= resultado["margen"] <= 1.0
    assert 0.0 <= resultado["cobertura_lexica"] <= 1.0
    assert len(resultado["top_3"]) == 3
    assert resultado["top_3"][0]["categoria"] == resultado["categoria_modelo"]
    assert resultado["version_modelo"] == modelo.metadatos["version_artefacto"]


def test_contrato_json_individual_tiene_solo_dos_campos(modelo) -> None:
    salida = clasificar_payload(
        {"descripcion": "Netflix", "valor": 15, "fecha": "2026-08-07"},
        modelo,
    )
    assert set(salida) == {"categoria", "confiabilidad"}
    assert salida["categoria"] == "SUSCRIPCIONES"
    assert 0.0 <= salida["confiabilidad"] <= 1.0


def test_contrato_json_lote_preserva_orden(modelo) -> None:
    payload = {
        "ingreso_mensual": 3000,
        "transacciones": [
            {"descripcion": "Spotify premium", "valor": 9.9, "fecha": "2026-08-07"},
            {
                "descripcion": "aporte a fondo mutuo",
                "valor": 100,
                "fecha": "2026-08-08T10:30:00-05:00",
            },
        ],
    }
    salida = clasificar_payload(payload, modelo)
    assert [fila["categoria"] for fila in salida["transacciones"]] == [
        "SUSCRIPCIONES",
        "APORTE_INVERSIONES",
    ]
    assert all(set(fila) == {"categoria", "confiabilidad"} for fila in salida["transacciones"])


def test_valor_y_fecha_no_cambian_la_prediccion(modelo) -> None:
    primera = clasificar_payload(
        {"descripcion": "viaje en taxi", "valor": 1, "fecha": "2025-01-01"}, modelo
    )
    segunda = clasificar_payload(
        {"descripcion": "viaje en taxi", "valor": 9999, "fecha": "2026-12-31"}, modelo
    )
    assert primera == segunda


@pytest.mark.parametrize(
    "payload",
    [
        {"descripcion": "Netflix", "valor": 15},
        {"descripcion": "", "valor": 15, "fecha": "2026-08-07"},
        {"descripcion": "Netflix", "valor": "15", "fecha": "2026-08-07"},
        {"descripcion": "Netflix", "valor": 15, "fecha": "07/08/2026"},
    ],
)
def test_contrato_json_rechaza_entradas_invalidas(modelo, payload) -> None:
    with pytest.raises(ValueError):
        clasificar_payload(payload, modelo)


def test_serializacion_pkl_y_checksum(modelo, tmp_path: Path) -> None:
    ruta = modelo.guardar(tmp_path / "modelo_prueba.pkl")
    assert ruta.suffix == ".pkl"
    assert ruta.with_suffix(".pkl.sha256").exists()
    recargado = cargar_modelo(ruta)
    assert recargado.predecir("boleto de bus")["categoria"] == "Transporte"


def test_extension_joblib_ya_no_es_valida(modelo, tmp_path: Path) -> None:
    with pytest.raises(ValueError, match=".pkl"):
        modelo.guardar(tmp_path / "modelo.joblib")


def test_checksum_detecta_archivo_alterado(modelo, tmp_path: Path) -> None:
    ruta = modelo.guardar(tmp_path / "modelo_alterado.pkl")
    with ruta.open("ab") as archivo:
        archivo.write(b"alteracion")
    with pytest.raises(ValueError, match="checksum"):
        cargar_modelo(ruta)


def test_version_anterior_del_pkl_se_rechaza(modelo, tmp_path: Path) -> None:
    anterior = copy.deepcopy(modelo)
    anterior.metadatos["version_artefacto"] = "3.0.0"
    ruta = anterior.guardar(tmp_path / "modelo_anterior.pkl")
    with pytest.raises(ValueError, match="se requiere exactamente 3.3.0"):
        cargar_modelo(ruta)


def test_manifiesto_coincide_con_pkl(modelo) -> None:
    manifiesto = json.loads(
        (RAIZ / "modelos" / "manifiesto_modelo.json").read_text(encoding="utf-8")
    )
    digest = hashlib.sha256(RUTA_MODELO.read_bytes()).hexdigest()
    assert manifiesto["version_artefacto"] == modelo.metadatos["version_artefacto"]
    assert manifiesto["sha256"] == digest


def test_exactitud_minima_en_holdout(modelo) -> None:
    prueba = pd.read_csv(RAIZ / "datos" / "holdout_final.csv")
    resultados = modelo.predecir_lote(prueba["descripcion"])
    predichas = [item["categoria_modelo"] for item in resultados]
    exactitud = sum(a == b for a, b in zip(predichas, prueba["categoria"])) / len(prueba)
    assert exactitud >= 0.85, f"Exactitud independiente demasiado baja: {exactitud:.1%}"
