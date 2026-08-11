"""
financial_analysis_pipeline.py

Punto de integración entre el módulo de Ciencia de Datos (Natalia) y
el Recommendation Engine (Mauricio).

Qué hace este archivo
----------------------
Envuelve, en un solo lugar, el flujo que hoy vive disperso en las
celdas de `recomendaciones.ipynb`:

    1. Clasificar el tipo de ingreso de cada transacción
       (modelo_tipo_ingreso_1.pkl + modelo_tipo_ingreso_2.pkl).
    2. Construir las variables financieras agregadas del usuario
       (generar_caracteristicas_usuario -> datos2).
    3. Predecir el perfil financiero y su probabilidad
       (perfil_financiero.pkl).
    4. Pasar ese resultado al RecommendationEngine para obtener las
       recomendaciones finales en JSON.

Por qué existe
----------------
Los notebooks son el lugar correcto para explorar y entrenar modelos,
pero NO para servir predicciones desde una API. Esta clase es la
versión "productizable" de las celdas 16 a 27 del notebook de
Natalia: mismo código, mismos nombres de columnas y modelos, pero
como funciones reutilizables que la API (o cualquier script) puede
llamar con datos nuevos.

Si Natalia cambia el preprocesamiento en el notebook, este archivo
debe actualizarse en paralelo — es, a propósito, un espejo de esas
celdas y no una reinterpretación libre de ellas.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from pathlib import Path
from typing import Dict, List, Union

import joblib
import pandas as pd

from .recommendation_service import RecommendationService


# Categorías que el pipeline de Natalia considera "ingresos" y no
# "gastos" al separar las transacciones.
_CATEGORIAS_INGRESO = [
    "Honorarios",
    "Rendimiento_inversiones",
    "Negocio",
    "Otros_Ingresos",
    "Salario",
    "Subsidios",
]

# Orden y nombre exactos de columnas que espera perfil_financiero.pkl
# (idéntico a `columnas_modelo` en recomendaciones.ipynb).
_COLUMNAS_MODELO = [
    "ingreso_mensual",
    "gasto_mensual_total",
    "tasa_ahorro",
    "objetivo_presupuesto",
    "relacion_deuda_ingreso",
    "pago_prestamo",
    "monto_inversion",
    "servicios_suscripcion",
    "fondo_emergencia",
    "cantidad_transacciones",
    "gastos_discrecionales",
    "gastos_esenciales",
    "tipo_ingreso",
    "alquiler_o_hipoteca",
    "estado_flujo_caja",
    "nivel_estres_financiero",
    "ahorro_real",
]


class FinancialAnalysisPipeline:
    """
    Orquesta el flujo completo: transacciones + datos del usuario
    -> perfil financiero -> recomendaciones.
    """

    def __init__(self, modelos_dir: Union[str, Path]):
        """
        Parameters
        ----------
        modelos_dir : str | Path
            Carpeta donde están los .pkl de Natalia
            (modelo_tipo_ingreso_1.pkl, modelo_tipo_ingreso_2.pkl,
            perfil_financiero.pkl).
        """

        modelos_dir = Path(modelos_dir)

        self.modelo_tipo_ingreso_cat = joblib.load(
            modelos_dir / "modelo_tipo_ingreso_1.pkl"
        )
        self.modelo_tipo_ingreso = joblib.load(
            modelos_dir / "modelo_tipo_ingreso_2.pkl"
        )
        self.modelo_pf = joblib.load(
            modelos_dir / "perfil_financiero.pkl"
        )

        self.recommendation_service = RecommendationService()

    # ------------------------------------------------------------
    # Paso 1: clasificar el tipo de ingreso de cada transacción
    # (celda 18 del notebook)
    # ------------------------------------------------------------
    def _clasificar_transacciones(self, df_usuario: pd.DataFrame) -> pd.DataFrame:

        df_usuario = df_usuario.copy()
        df_usuario["tipo_ingreso"] = None
        df_usuario["tipo_ingreso_1"] = None

        mask_ingresos = df_usuario["categoria"] == "Ingresos"

        if mask_ingresos.any():
            df_usuario.loc[mask_ingresos, "tipo_ingreso_1"] = (
                self.modelo_tipo_ingreso_cat.predict(
                    df_usuario.loc[mask_ingresos, "descripcion"]
                )
            )

        mask_clasificados = df_usuario["tipo_ingreso_1"].notna()

        if mask_clasificados.any():
            df_usuario.loc[mask_clasificados, "tipo_ingreso"] = (
                self.modelo_tipo_ingreso.predict(
                    df_usuario.loc[mask_clasificados, "tipo_ingreso_1"]
                )
            )

        # La categoría original se reemplaza por la sub-categoría de
        # ingreso cuando exista (igual que en el notebook).
        df_usuario["categoria"] = df_usuario["tipo_ingreso_1"].fillna(
            df_usuario["categoria"]
        )

        df_usuario.drop(columns=["tipo_ingreso_1"], inplace=True)

        return df_usuario

    # ------------------------------------------------------------
    # Paso 2: construir las variables agregadas del usuario
    # (celda 22 del notebook, generar_caracteristicas_usuario)
    # ------------------------------------------------------------
    @staticmethod
    def _generar_caracteristicas_usuario(
        ingreso_mensual: float,
        deuda_total: float,
        objetivo_presupuesto: float,
        pago_prestamo: float,
        servicios_suscripcion: int,
        fondo_emergencia: float,
        monto_inversion: float,
        transacciones: pd.DataFrame,
    ) -> pd.DataFrame:

        ingresos = transacciones[
            transacciones["categoria"].isin(_CATEGORIAS_INGRESO)
        ]
        gastos = transacciones[
            ~transacciones["categoria"].isin(_CATEGORIAS_INGRESO)
        ]

        gasto_mensual_total = gastos["valor"].sum()

        gastos_esenciales = gastos.loc[
            gastos["categoria"].isin([
                "Alimentacion", "Educacion", "Salud",
                "Servicios", "Transporte", "Vivienda",
            ]),
            "valor",
        ].sum()

        gastos_discrecionales = gastos.loc[
            gastos["categoria"].isin(["Ocio", "Gastos_hormiga", "Otros"]),
            "valor",
        ].sum()

        aporte_inversiones = gastos.loc[
            gastos["categoria"] == "Aporte_inversiones", "valor"
        ].sum()

        ahorro_real = ingreso_mensual - gasto_mensual_total + aporte_inversiones

        tasa_ahorro = (
            ahorro_real / ingreso_mensual if ingreso_mensual > 0 else 0
        )

        relacion_deuda_ingreso = (
            deuda_total / ingreso_mensual if ingreso_mensual > 0 else 0
        )

        monto_inversion_total = monto_inversion + aporte_inversiones

        alquiler_o_hipoteca = gastos.loc[
            gastos["categoria"] == "Vivienda", "valor"
        ].sum()

        if ahorro_real > 0:
            estado_flujo_caja = "Positivo"
        elif ahorro_real < 0:
            estado_flujo_caja = "Negativo"
        else:
            estado_flujo_caja = "Neutral"

        categorias_presentes = set(ingresos["categoria"])
        tiene_salario = "Salario" in categorias_presentes
        tiene_independiente = len(
            categorias_presentes.intersection({
                "Honorarios", "Negocio", "Subsidios",
                "Rendimiento_inversiones", "Otros_Ingresos",
            })
        ) > 0

        if tiene_salario and tiene_independiente:
            tipo_ingreso = "Mixto"
        elif tiene_salario:
            tipo_ingreso = "Salario"
        elif tiene_independiente:
            tipo_ingreso = "Independiente"
        else:
            tipo_ingreso = "Sin ingreso"

        if relacion_deuda_ingreso > 0.5 or ahorro_real < 0:
            nivel_estres_financiero = "Alto"
        elif relacion_deuda_ingreso > 0.3:
            nivel_estres_financiero = "Medio"
        else:
            nivel_estres_financiero = "Bajo"

        datos_modelo = pd.DataFrame({
            "ingreso_mensual": [ingreso_mensual],
            "gasto_mensual_total": [gasto_mensual_total],
            "tasa_ahorro": [tasa_ahorro],
            "objetivo_presupuesto": [objetivo_presupuesto],
            "relacion_deuda_ingreso": [relacion_deuda_ingreso],
            "pago_prestamo": [pago_prestamo],
            "monto_inversion": [monto_inversion_total],
            "servicios_suscripcion": [servicios_suscripcion],
            "fondo_emergencia": [fondo_emergencia],
            "cantidad_transacciones": [len(transacciones)],
            "gastos_discrecionales": [gastos_discrecionales],
            "gastos_esenciales": [gastos_esenciales],
            "tipo_ingreso": [tipo_ingreso],
            "alquiler_o_hipoteca": [alquiler_o_hipoteca],
            "estado_flujo_caja": [estado_flujo_caja],
            "nivel_estres_financiero": [nivel_estres_financiero],
            "ahorro_real": [ahorro_real],
        })

        return datos_modelo[_COLUMNAS_MODELO]

    # ------------------------------------------------------------
    # Flujo completo
    # ------------------------------------------------------------
    def run(
        self,
        transacciones: List[Dict],
        ingreso_mensual: float,
        deuda_total: float,
        objetivo_presupuesto: float,
        pago_prestamo: float,
        servicios_suscripcion: int,
        fondo_emergencia: float,
        monto_inversion: float,
    ) -> dict:
        """
        Ejecuta el flujo completo: transacciones crudas + datos
        estructurales del usuario -> JSON de recomendaciones.

        Parameters
        ----------
        transacciones : list[dict]
            Cada dict con las llaves: fecha, descripcion, categoria, valor
            (mismo formato que `datos` en la celda 16 del notebook).
        ingreso_mensual, deuda_total, objetivo_presupuesto,
        pago_prestamo, servicios_suscripcion, fondo_emergencia,
        monto_inversion : valores estructurales del usuario, tal como
            los recibe `generar_caracteristicas_usuario`.

        Returns
        -------
        dict
            Mismo formato que devuelve `RecommendationService.analyze()`:
            perfil_financiero, probabilidad y recomendaciones.
        """

        df_usuario = pd.DataFrame(transacciones)

        transacciones_clasificadas = self._clasificar_transacciones(df_usuario)

        datos2 = self._generar_caracteristicas_usuario(
            ingreso_mensual=ingreso_mensual,
            deuda_total=deuda_total,
            objetivo_presupuesto=objetivo_presupuesto,
            pago_prestamo=pago_prestamo,
            servicios_suscripcion=servicios_suscripcion,
            fondo_emergencia=fondo_emergencia,
            monto_inversion=monto_inversion,
            transacciones=transacciones_clasificadas,
        )

        perfil_predicho = self.modelo_pf.predict(datos2)[0]

        clases = self.modelo_pf.classes_
        probabilidades = self.modelo_pf.predict_proba(datos2)[0]
        resultado = dict(zip(clases, probabilidades))
        probabilidad_perfil = float(resultado[perfil_predicho])

        # datos2 trae tipos numpy (int64/float64), que no son
        # serializables a JSON directamente. Se castean a tipos
        # nativos de Python antes de pasarlos al motor de reglas.
        financial_data = {
            columna: (
                valor.item() if hasattr(valor, "item") else valor
            )
            for columna, valor in datos2.iloc[0].to_dict().items()
        }

        return self.recommendation_service.analyze(
            financial_profile=str(perfil_predicho),
            probability=probabilidad_perfil,
            financial_data=financial_data,
        )
