"""
financial_data_mapper.py

Adaptador entre la salida del pipeline de Ciencia de Datos (Natalia)
y el contrato que consume el RecommendationEngine.

Por que existe este archivo
----------------------------
`generar_caracteristicas_usuario` (notebook de Natalia) entrega un
DataFrame de una fila con estas columnas:

    ingreso_mensual, gasto_mensual_total, tasa_ahorro,
    objetivo_presupuesto, relacion_deuda_ingreso, pago_prestamo,
    monto_inversion, servicios_suscripcion, fondo_emergencia,
    cantidad_transacciones, gastos_discrecionales, gastos_esenciales,
    tipo_ingreso, alquiler_o_hipoteca, estado_flujo_caja,
    nivel_estres_financiero, ahorro_real

El motor de reglas necesita, ademas, un par de variables derivadas
que Natalia no calcula (por ejemplo "cuantos meses cubre el fondo de
emergencia"). Ese calculo vive aqui, en un solo lugar, para que las
reglas de negocio (`recommendation_rules.py`) nunca tengan que lidiar
con nombres de columnas ni con ausencias de datos.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from typing import Any, Dict


class FinancialDataMapper:
    """
    Normaliza y enriquece el diccionario de variables financieras
    de un usuario antes de que llegue al RecommendationEngine.
    """

    @staticmethod
    def map(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parameters
        ----------
        raw_data : dict
            Variables financieras del usuario, en el formato que
            produce el pipeline de Natalia (una fila de `datos2`
            convertida a diccionario, por ejemplo con
            `datos2.iloc[0].to_dict()`).

        Returns
        -------
        dict
            Copia de `raw_data` con las variables derivadas que
            necesita el motor de reglas ya calculadas.
        """

        data = dict(raw_data)  # copia defensiva: no mutar el original

        ingreso_mensual = data.get("ingreso_mensual", 0) or 0
        gasto_mensual_total = data.get("gasto_mensual_total", 0) or 0
        gastos_esenciales = data.get("gastos_esenciales", 0) or 0
        fondo_emergencia = data.get("fondo_emergencia", 0) or 0

        # ------------------------------------------------------------
        # ahorro_real: Natalia ya lo calcula. Si por algun motivo no
        # viene en el diccionario (ej. pruebas unitarias con datos
        # parciales), lo derivamos con la formula basica.
        # ------------------------------------------------------------
        data.setdefault(
            "ahorro_real",
            ingreso_mensual - gasto_mensual_total
        )

        # ------------------------------------------------------------
        # meses_reserva: cuantos meses de gastos esenciales cubre el
        # fondo de emergencia. Se usa gastos_esenciales como base
        # porque es el estandar en educacion financiera (un fondo de
        # emergencia debe cubrir lo indispensable, no lo discrecional).
        # Si no hay gastos_esenciales disponibles, se cae al gasto
        # mensual total como aproximacion.
        # ------------------------------------------------------------
        base_gasto = gastos_esenciales if gastos_esenciales > 0 else gasto_mensual_total

        data["meses_reserva"] = (
            round(fondo_emergencia / base_gasto, 2)
            if base_gasto > 0
            else 0.0
        )

        return data
