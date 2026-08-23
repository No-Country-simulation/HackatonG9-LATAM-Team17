"""
financial_data_adapter.py

Normaliza el diccionario de variables financieras que llega desde el
pipeline de Ciencia de Datos (Natalia) hacia el formato que consume el
Recommendation Engine, y calcula variables derivadas que las reglas
necesitan pero que el modelo de ML no entrega directamente
(ej. meses_reserva, ratio_suscripciones).

Por qué existe este módulo
---------------------------
El notebook `recomendaciones.ipynb` de Natalia produce un diccionario
con las columnas de `columnas_modelo`:

    ingreso_mensual, gasto_mensual_total, tasa_ahorro,
    objetivo_presupuesto, relacion_deuda_ingreso, pago_prestamo,
    monto_inversion, servicios_suscripcion, fondo_emergencia,
    cantidad_transacciones, gastos_discrecionales, gastos_esenciales,
    tipo_ingreso, alquiler_o_hipoteca, estado_flujo_caja,
    nivel_estres_financiero, ahorro_real

Las reglas de negocio originales fueron escritas contra nombres
distintos (`nivel_endeudamiento`, `gastos_totales`, `meses_reserva`)
que NUNCA llegan desde el modelo real. Como `dict.get(clave, 0)` no
lanza error cuando la clave no existe, el motor generaba
recomendaciones incorrectas de forma silenciosa. Este adaptador cierra
esa brecha en un único lugar.

Autor: Mauricio Medina
"""

from typing import Optional


# ----------------------------------------------------------------
# Alias de compatibilidad hacia atrás: si alguien (backend, tests,
# datos de ejemplo antiguos) todavía envía los nombres genéricos,
# los mapeamos al nombre real que usa el modelo, en vez de fallar
# en silencio.
# ----------------------------------------------------------------
_ALIASES = {
    "nivel_endeudamiento": "relacion_deuda_ingreso",
    "gastos_totales": "gasto_mensual_total",
}


def adapt(raw_data: dict) -> dict:
    """
    Recibe el diccionario de variables financieras del usuario y
    devuelve una copia enriquecida con los campos derivados que
    necesitan las reglas de negocio.

    Parameters
    ----------
    raw_data : dict
        Variables financieras, en el formato producido por
        `generar_caracteristicas_usuario` (Natalia) o, por
        compatibilidad, en el formato genérico anterior.

    Returns
    -------
    dict
        Copia de `raw_data` con los alias resueltos y los campos
        derivados añadidos (`meses_reserva`, `ratio_suscripciones`).
    """

    data = dict(raw_data)  # copia defensiva: nunca mutar el original

    # --------------------------------------------------------
    # 1. Resolver alias de compatibilidad
    # --------------------------------------------------------
    for alias, real_name in _ALIASES.items():
        if alias in data and real_name not in data:
            data[real_name] = data[alias]

    ingreso_mensual = _to_float(data.get("ingreso_mensual"))
    gasto_mensual_total = _to_float(data.get("gasto_mensual_total"))
    gastos_esenciales = _to_float(data.get("gastos_esenciales"))
    fondo_emergencia = _to_float(data.get("fondo_emergencia"))
    servicios_suscripcion = _to_float(data.get("servicios_suscripcion"))
    ahorro_real = data.get("ahorro_real")

    # --------------------------------------------------------
    # 2. meses_reserva: cuántos meses de gastos esenciales cubre
    #    el fondo de emergencia actual.
    #    Se usa gastos_esenciales como base (estándar en
    #    educación financiera: el fondo debe cubrir lo
    #    indispensable, no el gasto discrecional). Si no está
    #    disponible, se usa el gasto mensual total como respaldo.
    # --------------------------------------------------------
    base_gasto = gastos_esenciales if gastos_esenciales > 0 else gasto_mensual_total
    data["meses_reserva"] = (
        fondo_emergencia / base_gasto if base_gasto > 0 else 0.0
    )

    # --------------------------------------------------------
    # 3. ratio_suscripciones: peso de las suscripciones sobre
    #    el ingreso mensual.
    # --------------------------------------------------------
    data["ratio_suscripciones"] = (
        servicios_suscripcion / ingreso_mensual if ingreso_mensual > 0 else 0.0
    )

    # --------------------------------------------------------
    # 4. ahorro_real de respaldo, por si no viene calculado
    #    (por ejemplo, en pruebas manuales del engine).
    # --------------------------------------------------------
    if ahorro_real is None:
        data["ahorro_real"] = ingreso_mensual - gasto_mensual_total

    return data


def _to_float(value) -> float:
    """Convierte a float de forma segura; None o inválido -> 0.0."""
    if value is None:
        return 0.0
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0