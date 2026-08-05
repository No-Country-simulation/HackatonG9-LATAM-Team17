"""
recommendation_rules.py

Reglas de negocio del motor de recomendaciones.

Todas las reglas asumen que `financial_data` ya pasó por
`financial_data_adapter.adapt()`, por lo que pueden confiar en que
existen las claves reales del modelo de Natalia
(`relacion_deuda_ingreso`, `gasto_mensual_total`, `ahorro_real`, etc.)
y los campos derivados (`meses_reserva`, `ratio_suscripciones`).

Escala de prioridad usada en todo el módulo (0 = más urgente):
    0 -> Perfil financiero crítico
    1 -> Riesgos graves (endeudamiento, sin fondo de emergencia,
         flujo de caja negativo, perfil "En riesgo")
    2 -> Alertas moderadas (ahorro bajo, fondo de emergencia parcial,
         flujo de caja ajustado, perfil "En observación")
    3 -> Mejoras de optimización (suscripciones, perfiles
         estables/saludables)
    4 -> Informativo (perfil excelente, confianza del modelo)

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from .recommendation_models import Recommendation


def evaluate_savings_rate(financial_data: dict):
    """
    Evalúa si el usuario está ahorrando lo suficiente.

    Campo real del modelo: `tasa_ahorro` (ya viene con este nombre
    desde Natalia, no requiere alias).
    """

    savings_rate = financial_data.get("tasa_ahorro", 0) or 0

    if savings_rate < 0.10:
        return Recommendation(
            categoria="Ahorro",
            prioridad=2,
            titulo="Incrementar el ahorro",
            explicacion=(
                f"Tu tasa de ahorro actual es de {savings_rate * 100:.1f}%, "
                "por debajo del 10% recomendado."
            ),
            accion="Intenta ahorrar al menos el 10% de tus ingresos mensuales.",
            impacto="Medio",
            score=0.60,
        )

    return None


def evaluate_debt_ratio(financial_data: dict):
    """
    Evalúa el nivel de endeudamiento del usuario.

    Campo real del modelo: `relacion_deuda_ingreso`
    (antes se leía incorrectamente `nivel_endeudamiento`, clave que
    el modelo nunca produce).
    """

    debt_ratio = financial_data.get("relacion_deuda_ingreso", 0) or 0

    if debt_ratio > 0.40:
        return Recommendation(
            categoria="Endeudamiento",
            prioridad=1,
            titulo="Reducir el nivel de endeudamiento",
            explicacion=(
                f"Tu relación deuda/ingreso es de {debt_ratio * 100:.1f}%, "
                "por encima del 40% considerado saludable."
            ),
            accion="Prioriza el pago de deudas antes de adquirir nuevos compromisos financieros.",
            impacto="Alto",
            score=0.85,
        )

    return None


def evaluate_emergency_fund(financial_data: dict):
    """
    Evalúa el fondo de emergencia.

    Campo real del modelo: `fondo_emergencia` (monto en dinero).
    `meses_reserva` no existe en el modelo de Natalia; se calcula en
    `financial_data_adapter.adapt()` como
    fondo_emergencia / gastos_esenciales (o gasto_mensual_total si
    gastos_esenciales no está disponible).
    """

    emergency_months = financial_data.get("meses_reserva", 0) or 0

    if emergency_months < 3:
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=1,
            titulo="Crear un fondo de emergencia",
            explicacion=(
                f"Tu fondo de emergencia cubre {emergency_months:.1f} meses "
                "de gastos, menos de los 3 meses mínimos recomendados."
            ),
            accion="Procura ahorrar hasta cubrir entre 3 y 6 meses de tus gastos esenciales.",
            impacto="Alto",
            score=0.80,
        )

    elif emergency_months < 6:
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=2,
            titulo="Fortalecer el fondo de emergencia",
            explicacion=(
                f"Tu fondo de emergencia cubre {emergency_months:.1f} meses "
                "de gastos. Puede fortalecerse."
            ),
            accion="Continúa incrementando tu reserva hasta cubrir al menos 6 meses.",
            impacto="Medio",
            score=0.55,
        )

    return None


def evaluate_cash_flow(financial_data: dict):
    """
    Evalúa el flujo de caja mensual.

    Usa `ahorro_real` (ya calculado por Natalia como
    ingreso - gasto + aporte_inversiones) en lugar de recalcularlo con
    campos que no existen (`gastos_totales`). El adaptador garantiza
    que `ahorro_real` siempre esté presente como respaldo.
    """

    income = financial_data.get("ingreso_mensual", 0) or 0
    cash_flow = financial_data.get("ahorro_real", 0) or 0

    if cash_flow <= 0:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=1,
            titulo="Reducir los gastos mensuales",
            explicacion="Tus gastos son iguales o superiores a tus ingresos.",
            accion="Reduce gastos no esenciales para recuperar un flujo de caja positivo.",
            impacto="Alto",
            score=0.85,
        )

    elif income > 0 and cash_flow < income * 0.10:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=2,
            titulo="Mejorar el flujo de caja",
            explicacion="Tu margen disponible al final del mes es muy bajo.",
            accion="Intenta disminuir algunos gastos para aumentar tu capacidad de ahorro.",
            impacto="Medio",
            score=0.55,
        )

    return None


def evaluate_subscriptions(financial_data: dict):
    """
    Evalúa el peso de los servicios de suscripción sobre el ingreso.

    Campo real del modelo: `servicios_suscripcion` (monto mensual).
    El ratio contra el ingreso se calcula en el adaptador
    (`ratio_suscripciones`). Esta regla no existía en la versión
    anterior, pero el enunciado del hackathon la menciona
    explícitamente como ejemplo de recomendación
    ("mejorar el control de los gastos recurrentes").
    """

    ratio = financial_data.get("ratio_suscripciones", 0) or 0
    monto = financial_data.get("servicios_suscripcion", 0) or 0

    if ratio > 0.05:
        return Recommendation(
            categoria="Gastos recurrentes",
            prioridad=3,
            titulo="Revisar suscripciones activas",
            explicacion=(
                f"Tus suscripciones (${monto:.0f}) representan más del 5% "
                "de tu ingreso mensual."
            ),
            accion="Evalúa cancelar o pausar servicios que no uses con frecuencia.",
            impacto="Bajo",
            score=0.35,
        )

    return None


def evaluate_financial_profile(financial_profile: str):
    """
    Genera recomendaciones según el perfil financiero obtenido por el
    modelo de Machine Learning.

    Cubre las 6 clases que el modelo realmente entrena
    (`perfil_financiero.pkl`): Excelente, Saludable, Estable,
    En observación, En riesgo, Crítico. La versión anterior solo
    cubría 3 de las 6, dejando sin recomendación a la mitad de los
    usuarios posibles.
    """

    if financial_profile == "Crítico":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=0,
            titulo="Actuar de inmediato sobre tu situación financiera",
            explicacion=(
                "El modelo detectó que tu perfil financiero está en "
                "estado crítico, con señales de riesgo elevado en "
                "varios indicadores a la vez."
            ),
            accion=(
                "Considera buscar asesoría financiera profesional, "
                "prioriza el pago de deudas urgentes y reduce de "
                "inmediato los gastos no esenciales."
            ),
            impacto="Alto",
            score=0.95,
        )

    elif financial_profile == "En riesgo":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=1,
            titulo="Mejorar la salud financiera",
            explicacion="El modelo detectó que tu perfil financiero presenta un nivel de riesgo elevado.",
            accion="Reduce gastos no esenciales, prioriza el pago de deudas y fortalece tu ahorro.",
            impacto="Alto",
            score=0.80,
        )

    elif financial_profile == "En observación":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=2,
            titulo="Fortalecer los hábitos financieros",
            explicacion="Tu situación financiera requiere seguimiento para evitar un mayor riesgo.",
            accion="Incrementa tu ahorro mensual y controla los gastos recurrentes.",
            impacto="Medio",
            score=0.60,
        )

    elif financial_profile == "Estable":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=3,
            titulo="Consolidar tu estabilidad financiera",
            explicacion=(
                "Tu perfil financiero es estable, sin señales de "
                "riesgo inmediato, pero con margen de mejora."
            ),
            accion="Automatiza tu ahorro y revisa opciones de inversión de bajo riesgo.",
            impacto="Medio",
            score=0.50,
        )

    elif financial_profile == "Saludable":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=3,
            titulo="Mantener una buena salud financiera",
            explicacion="Tu comportamiento financiero es positivo.",
            accion="Continúa con tus hábitos de ahorro y evalúa opciones de inversión.",
            impacto="Bajo",
            score=0.40,
        )

    elif financial_profile == "Excelente":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=4,
            titulo="Aprovechar tu excelente salud financiera",
            explicacion=(
                "Tu perfil financiero es excelente: tus hábitos de "
                "ahorro, gasto y endeudamiento están muy bien "
                "gestionados."
            ),
            accion=(
                "Evalúa diversificar tus inversiones y define metas "
                "financieras de largo plazo."
            ),
            impacto="Bajo",
            score=0.25,
        )

    return None


def evaluate_confidence(probability):
    """
    Evalúa la confianza que el modelo de ML tuvo al clasificar el
    perfil financiero del usuario.

    La versión anterior recibía `probabilidad` en el servicio pero
    nunca la usaba dentro del motor de reglas; solo se serializaba
    sin aportar valor. Aquí se convierte en una recomendación
    informativa cuando la confianza es baja, para que el usuario (o
    el equipo de soporte) sepa que el resultado puede no ser preciso.
    """

    if probability is None:
        return None

    if probability < 0.60:
        return Recommendation(
            categoria="Confianza del modelo",
            prioridad=4,
            titulo="Verificar información financiera",
            explicacion=(
                f"El modelo tiene una confianza de {probability * 100:.0f}% "
                "en esta clasificación, un nivel relativamente bajo."
            ),
            accion="Revisa que tus datos financieros estén completos y actualizados para un análisis más preciso.",
            impacto="Informativo",
            score=probability,
        )

    return None