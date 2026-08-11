"""
recommendation_rules.py

Reglas de negocio del motor de recomendaciones.

IMPORTANTE sobre los nombres de campo
--------------------------------------
Estas reglas consumen el diccionario ya procesado por
`FinancialDataMapper`, que usa los MISMOS nombres de columna que
produce el pipeline de Natalia (`generar_caracteristicas_usuario`):

    tasa_ahorro, relacion_deuda_ingreso, fondo_emergencia,
    gastos_esenciales, ingreso_mensual, ahorro_real,
    estado_flujo_caja, servicios_suscripcion

Mas la variable derivada por el mapper:

    meses_reserva

No se deben inventar nombres nuevos aquí (ej. "nivel_endeudamiento",
"gastos_totales", "meses_reserva" crudo): si el backend cambia el
contrato, el cambio se hace en `financial_data_mapper.py`, no aquí.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from .recommendation_models import Recommendation


def evaluate_savings_rate(financial_data: dict):
    """
    Evalúa si el usuario está ahorrando lo suficiente.

    `tasa_ahorro` viene como proporción (0.0 - 1.0), no como
    porcentaje, según el dataset de Natalia.
    """

    savings_rate = financial_data.get("tasa_ahorro", 0)

    if savings_rate < 0.10:
        return Recommendation(
            categoria="Ahorro",
            prioridad=2,
            titulo="Incrementar el ahorro",
            explicacion="Tu tasa de ahorro es inferior al 10% de tus ingresos.",
            accion="Intenta ahorrar al menos el 10% de tus ingresos mensuales.",
            impacto="Alto",
            score=0.70
        )

    return None


def evaluate_debt_ratio(financial_data: dict):
    """
    Evalúa el nivel de endeudamiento del usuario a partir de
    `relacion_deuda_ingreso` (proporción 0.0 - 1.0).
    """

    debt_ratio = financial_data.get("relacion_deuda_ingreso", 0)

    if debt_ratio > 0.40:
        return Recommendation(
            categoria="Endeudamiento",
            prioridad=1,
            titulo="Reducir el nivel de endeudamiento",
            explicacion="Tu relación deuda/ingreso supera el 40%.",
            accion="Prioriza el pago de deudas antes de adquirir nuevos compromisos financieros.",
            impacto="Alto",
            score=0.90
        )

    return None


def evaluate_emergency_fund(financial_data: dict):
    """
    Evalúa el fondo de emergencia usando `meses_reserva`, variable
    derivada por FinancialDataMapper como
    fondo_emergencia / gastos_esenciales.
    """

    emergency_months = financial_data.get("meses_reserva", 0)

    if emergency_months < 3:
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=1,
            titulo="Crear un fondo de emergencia",
            explicacion="Tu fondo de emergencia cubre menos de 3 meses de tus gastos esenciales.",
            accion="Procura ahorrar hasta cubrir entre 3 y 6 meses de tus gastos esenciales.",
            impacto="Alto",
            score=0.85
        )

    elif emergency_months < 6:
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=2,
            titulo="Fortalecer el fondo de emergencia",
            explicacion="Tu fondo de emergencia cubre entre 3 y 6 meses de gastos esenciales.",
            accion="Continúa incrementando tu reserva hasta cubrir al menos 6 meses.",
            impacto="Medio",
            score=0.55
        )

    return None


def evaluate_cash_flow(financial_data: dict):
    """
    Evalúa el flujo de caja mensual usando `ahorro_real` (ya calculado
    por Natalia como ingreso - gasto + aportes a inversión) en lugar
    de recalcularlo con campos que no existen en el pipeline.
    """

    income = financial_data.get("ingreso_mensual", 0)
    real_savings = financial_data.get("ahorro_real", 0)

    if real_savings <= 0:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=1,
            titulo="Reducir los gastos mensuales",
            explicacion="Tus gastos son iguales o superiores a tus ingresos este mes.",
            accion="Reduce gastos no esenciales para recuperar un flujo de caja positivo.",
            impacto="Alto",
            score=0.95
        )

    elif income > 0 and real_savings < income * 0.10:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=2,
            titulo="Mejorar el flujo de caja",
            explicacion="Tu margen disponible al final del mes es muy bajo.",
            accion="Intenta disminuir algunos gastos para aumentar tu capacidad de ahorro.",
            impacto="Medio",
            score=0.60
        )

    return None


def evaluate_subscriptions(financial_data: dict):
    """
    Evalúa la cantidad de servicios por suscripción activos.

    `servicios_suscripcion` es un CONTEO de suscripciones activas
    (no un monto en dinero) según el dataset de Natalia, con un
    rango observado de 1 a 9.
    """

    subscriptions = financial_data.get("servicios_suscripcion", 0)

    if subscriptions >= 6:
        return Recommendation(
            categoria="Gastos recurrentes",
            prioridad=3,
            titulo="Revisar servicios por suscripción",
            explicacion=f"Tienes {subscriptions} suscripciones activas, un número elevado de gastos recurrentes.",
            accion="Revisa cuáles suscripciones realmente usas y cancela las que no aporten valor.",
            impacto="Bajo",
            score=0.35
        )

    return None


# ==========================================================
# Perfil financiero
# ==========================================================
#
# El modelo de Natalia (perfil_financiero.pkl) clasifica en 6 clases:
# Excelente, Saludable, Estable, En observación, En riesgo, Crítico.
# Cada una tiene su propia recomendación de nivel general; las reglas
# anteriores ya cubren el detalle por variable.

_PERFIL_RECOMENDACIONES = {

    "Crítico": dict(
        prioridad=1,
        titulo="Actuar de inmediato sobre tu salud financiera",
        explicacion="El modelo detectó un perfil financiero crítico: alto riesgo de insolvencia.",
        accion="Detén gastos no esenciales, busca renegociar deudas y considera asesoría financiera profesional.",
        impacto="Alto",
        score=1.00
    ),

    "En riesgo": dict(
        prioridad=1,
        titulo="Mejorar la salud financiera",
        explicacion="El modelo detectó que tu perfil financiero presenta un nivel de riesgo elevado.",
        accion="Reduce gastos no esenciales, prioriza el pago de deudas y fortalece tu ahorro.",
        impacto="Alto",
        score=0.85
    ),

    "En observación": dict(
        prioridad=2,
        titulo="Fortalecer los hábitos financieros",
        explicacion="Tu situación financiera requiere seguimiento para evitar un mayor riesgo.",
        accion="Incrementa tu ahorro mensual y controla los gastos recurrentes.",
        impacto="Medio",
        score=0.60
    ),

    "Estable": dict(
        prioridad=3,
        titulo="Consolidar tu estabilidad financiera",
        explicacion="Tu perfil financiero es estable, con margen para optimizar tus hábitos.",
        accion="Aumenta gradualmente tu tasa de ahorro y revisa tus gastos discrecionales.",
        impacto="Medio",
        score=0.45
    ),

    "Saludable": dict(
        prioridad=3,
        titulo="Mantener una buena salud financiera",
        explicacion="Tu comportamiento financiero es positivo.",
        accion="Continúa con tus hábitos de ahorro y evalúa opciones de inversión.",
        impacto="Bajo",
        score=0.30
    ),

    "Excelente": dict(
        prioridad=4,
        titulo="Explorar oportunidades de crecimiento patrimonial",
        explicacion="Tu perfil financiero es excelente: tus indicadores están muy por encima del promedio.",
        accion="Evalúa diversificar tus inversiones y planificar metas financieras de largo plazo.",
        impacto="Bajo",
        score=0.20
    ),

}


def evaluate_financial_profile(financial_profile: str):
    """
    Genera una recomendación general según el perfil financiero
    obtenido por el modelo de Machine Learning. Cubre las 6 clases
    que puede devolver `perfil_financiero.pkl`.
    """

    plantilla = _PERFIL_RECOMENDACIONES.get(financial_profile)

    if plantilla is None:
        return None

    return Recommendation(
        categoria="Perfil financiero",
        **plantilla
    )
