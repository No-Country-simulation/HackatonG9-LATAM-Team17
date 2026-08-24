"""
recommendation_rules.py - Motor de reglas de negocio avanzado
Sistema de recomendaciones financieras.
"""

from .recommendation_models import Recommendation
import random

def evaluate_savings_rate(financial_data: dict):
    """
    Evalúa la tasa de ahorro con múltiples alternativas de recomendación.
    """
    savings_rate = financial_data.get("tasa_ahorro", 0) or 0
    income = financial_data.get("ingreso_mensual", 0) or 0
    ahorro_ideal = income * 0.20

    consejos_ahorro_bajo = [
        "Configura una transferencia automática el mismo día que recibas tus ingresos hacia una cuenta de ahorros separada.",
        "Implementa la regla 50/30/20: destina el 50% a necesidades, 30% a deseos y 20% estrictamente a ahorro e inversión.",
        "Aparte un porcentaje fijo de cada entrada de dinero antes de realizar cualquier gasto discrecional."
    ]
    
    consejos_ahorro_alto = [
        f"Considera llevar tu meta al 20% (${ahorro_ideal:,.0f}) y canaliza el exceso hacia fondos de inversión indexados de bajo riesgo.",
        "Explora instrumentos financieros de renta fija a plazo fijo para proteger tu capital acumulado frente a la inflación.",
        "Diversifica tus excedentes en portafolios de inversión de mediano plazo para potenciar el interés compuesto."
    ]

    if savings_rate < 0.10:
        return Recommendation(
            categoria="Ahorro",
            prioridad=2,
            titulo="Acelerar el ritmo de acumulación de capital",
            explicacion=(
                f"Tu tasa de ahorro actual es de {savings_rate * 100:.1f}%, "
                f"situándote por debajo del umbral mínimo de seguridad del 10% para un ingreso de ${income:,.0f}."
            ),
            accion=random.choice(consejos_ahorro_bajo),
            impacto="Medio",
            score=0.65,
        )
    elif savings_rate >= 0.20:
        return Recommendation(
            categoria="Ahorro",
            prioridad=3,
            titulo="Optimización de excedentes y capital ocioso",
            explicacion=f"¡Excelente! Estás ahorrando un {savings_rate * 100:.1f}% de tus ingresos, lo que denota una alta disciplina.",
            accion=random.choice(consejos_ahorro_alto),
            impacto="Bajo",
            score=0.30,
        )

    return None


def evaluate_debt_ratio(financial_data: dict):
    """
    Evalúa el endeudamiento con alternativas de acción variadas.
    """
    debt_ratio = financial_data.get("relacion_deuda_ingreso", 0) or 0
    deuda_total = financial_data.get("deuda_total", 0) or 0
    ingreso = financial_data.get("ingreso_mensual", 0) or 0

    estrategias_deuda_alta = [
        "Aplica el método de bola de nieve o avalancha para liquidar primero las deudas con mayores tasas de interés.",
        "Contacta a tus entidades financieras para evaluar una consolidación o renegociación de plazos que reduzca tu cuota mensual.",
        "Destina temporalmente cualquier ingreso extra (bonos, ventas ocasionales) exclusivamente a recortar capital adeudado."
    ]
    
    estrategias_deuda_baja = [
        "Evita diferir compras cotidianas a más de una cuota en tarjeta de crédito para prevenir pasivos acumulativos.",
        "Mantén tus pagos domiciliados para evitar cargos por mora y conservar un historial crediticio impecable."
    ]

    if debt_ratio > 0.40:
        exceso = deuda_total - (ingreso * 0.40)
        return Recommendation(
            categoria="Endeudamiento",
            prioridad=1,
            titulo="Estrategia de alivio de carga financiera crítica",
            explicacion=(
                f"Tu relación deuda/ingreso es del {debt_ratio * 100:.1f}%. "
                f"Estás excediendo el límite saludable por aproximadamente ${max(exceso, 0):,.0f}."
            ),
            accion=random.choice(estrategias_deuda_alta),
            impacto="Alto",
            score=0.92,
        )
    elif debt_ratio > 0:
        return Recommendation(
            categoria="Endeudamiento",
            prioridad=3,
            titulo="Control preventivo de pasivos de consumo",
            explicacion=f"Tu nivel de endeudamiento se encuentra en un manejable {debt_ratio * 100:.1f}% de tus ingresos.",
            accion=random.choice(estrategias_deuda_baja),
            impacto="Bajo",
            score=0.35,
        )

    return None


def evaluate_emergency_fund(financial_data: dict):
    """
    Evalúa la robustez del fondo de emergencia con subrangos detallados
    y un banco amplio de opciones aleatorias para eliminar la monotonía.
    """
    emergency_months = financial_data.get("meses_reserva", 0) or 0
    gasto_mensual = financial_data.get("gasto_mensual_total", 0) or financial_data.get("gastos_esenciales", 0) or 0

    if emergency_months <= 0.1:
        consejos_cero = [
            "Te encuentras completamente expuesto ante cualquier imprevisto médico o laboral. Empieza por apartar una pequeña cuota semanal intocable.",
            "Tu colchón financiero es nulo. Tu prioridad absoluta este mes debe ser crear una reserva inicial equivalente a al menos dos semanas de tus gastos básicos.",
            "Cada día sin ahorros aumenta tu vulnerabilidad. Intenta destinar el 5% de cualquier ingreso menor directamente a una alcancía intocable.",
            "Estás operando al límite operativo. Detén de inmediato cualquier gasto de ocio temporal y redirige esos fondos hacia tu primera reserva de emergencia."
        ]
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=1,
            titulo="Ausencia total de red de contención",
            explicacion="No posees meses de reserva registrados, lo que eleva drásticamente tu vulnerabilidad financiera ante choques externos.",
            accion=random.choice(consejos_cero),
            impacto="Alto",
            score=0.95,
        )

    elif emergency_months < 1.5:
        dinero_faltante = (3 - emergency_months) * gasto_mensual
        ahorro_semanal = dinero_faltante / 12 
        consejos_principio = [
            "Estás dando los primeros pasos, pero el riesgo sigue siendo alto. Destina cualquier ingreso extra o bono directamente a esta cuenta.",
            f"Tienes un pequeño avance, pero te faltan cerca de ${max(dinero_faltante, 0):,.0f}. Intenta apartar unos ${max(ahorro_semanal, 0):,.0f} cada semana para acortar la brecha.",
            "Tu fondo está en fase de gestación. Automatiza una transferencia quincenal fija, por pequeña que sea, para ver crecer este colchón sin esfuerzo mental.",
            "Buen inicio, pero insuficiente para una crisis prolongada. Revisa si puedes vender algún activo o artículo que no uses para capitalizar este fondo."
        ]
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=1,
            titulo="Fondo de emergencia en etapa inicial",
            explicacion=f"Tu reserva actual cubre apenas {emergency_months:.1f} meses de tus gastos operativos.",
            accion=random.choice(consejos_principio),
            impacto="Alto",
            score=0.85,
        )

    elif emergency_months < 3:
        dinero_faltante = (3 - emergency_months) * gasto_mensual
        consejos_cerca = [
            f"Estás a un paso de la meta inicial. Solo te faltan unos ${max(dinero_faltante, 0):,.0f} para completar el colchón de seguridad de 3 meses.",
            "Ya superaste la fase más difícil de arranque. Haz un último esfuerzo de recorte este mes para consolidar tus 3 meses reglamentarios.",
            "Estás muy cerca de la línea de base segura. No aflojes el ritmo de ahorro ahora que el objetivo principal está al alcance de la mano.",
            f"Te restan solo fracciones para completar tu blindaje básico. Focaliza un 10% extra de tus ingresos corrientes de este mes para cerrar esta meta."
        ]
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=2,
            titulo="A un paso del fondo de seguridad básico",
            explicacion=f"Tu cobertura actual es de {emergency_months:.1f} meses; estás muy cerca de alcanzar el estándar mínimo recomendado.",
            accion=random.choice(consejos_cerca),
            impacto="Medio",
            score=0.70,
        )

    elif emergency_months < 6:
        consejos_medio = [
            "Incrementa gradualmente tu reserva hasta llegar a los 6 meses para protegerte ante imprevistos mayores de índole laboral o familiar.",
            "Mantén este fondo en un instrumento de bajo riesgo y alta liquidez que te permita retirar dinero de forma inmediata si lo requieres.",
            "Has alcanzado un nivel de tranquilidad financiero respetable. El siguiente paso lógico es escalar la reserva de 3 a 6 meses de forma paulatina."
        ]
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=2,
            titulo="Fortalece tu colchón financiero",
            explicacion=f"Tienes cubiertos {emergency_months:.1f} meses de tus gastos. Has asegurado el mínimo y vas por excelente camino.",
            accion=random.choice(consejos_medio),
            impacto="Medio",
            score=0.50,
        )

    else:
        consejos_excelente = [
            "Dado que tu liquidez está blindada, cualquier ahorro adicional debe migrar directamente a portafolios de inversión a mediano y largo plazo.",
            "Posees una salud de liquidez envidiable. Considera poner a trabajar un porcentaje de este excedente en instrumentos de renta fija o variable diversificada."
        ]
        return Recommendation(
            categoria="Fondo de emergencia",
            prioridad=4,
            titulo="Colchón de emergencia robusto consolidado",
            explicacion=f"Posees {emergency_months:.1f} meses de respaldo, lo cual excede con éxito el estándar óptimo de seguridad.",
            accion=random.choice(consejos_excelente),
            impacto="Bajo",
            score=0.20,
        )


def evaluate_cash_flow(financial_data: dict):
    """
    Evalúa el flujo de caja mensual con alternativas de acción dinámicas.
    """
    income = financial_data.get("ingreso_mensual", 0) or 0
    cash_flow = financial_data.get("ahorro_real", 0) or 0

    consejos_deficit = [
        "Realiza un presupuesto base cero este mes: congela salidas, compras de ropa y servicios de entretenimiento no vitales.",
        "Haz una auditoría de tus últimos movimientos bancarios para clasificar y recortar de inmediato los gastos hormiga."
    ]

    if cash_flow <= 0:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=1,
            titulo="Restructuración urgente de gastos corrientes",
            explicacion=f"Tu flujo de caja es deficitario o nulo frente a ingresos de ${income:,.0f}.",
            accion=random.choice(consejos_deficit),
            impacto="Alto",
            score=0.95,
        )
    elif income > 0 and cash_flow < income * 0.10:
        return Recommendation(
            categoria="Flujo de caja",
            prioridad=2,
            titulo="Optimización de margen de liquidez ajustado",
            explicacion=f"Tu sobrante mensual es ajustado (${cash_flow:,.0f}), lo que te deja vulnerable ante imprevistos operativos.",
            accion="Identifica al menos dos fugas de dinero hormiga en comercios o aplicaciones para liberar liquidez adicional.",
            impacto="Medio",
            score=0.55,
        )

    return None


def evaluate_subscriptions(financial_data: dict):
    """
    Evalúa el impacto económico de las suscripciones y membresías.
    """
    ratio = financial_data.get("ratio_suscripciones", 0) or 0
    monto = financial_data.get("servicios_suscripcion", 0) or 0

    if ratio > 0.03 or monto > 0:
        return Recommendation(
            categoria="Gastos recurrentes",
            prioridad=3,
            titulo="Optimización de membresías y servicios digitales",
            explicacion=(
                f"Destinas ${monto:,.0f} mensuales "
                f"({ratio * 100:.1f}% de tus ingresos) a cobros recurrentes automáticos."
            ),
            accion="Audita tus estados de cuenta: cancela plataformas de streaming o software que no registren uso activo en las últimas 4 semanas.",
            impacto="Bajo",
            score=0.45,
        )

    return None


def evaluate_financial_profile(financial_profile: str):
    """
    Genera recomendaciones de estrategia patrimonial enriquecidas con opciones aleatorias.
    """
    consejos_riesgo = [
        "Reduce de inmediato tus gastos no esenciales, congela el uso de tarjetas de crédito y enfócate en sanear tus finanzas.",
        "Establece un presupuesto de supervivencia estricto durante los próximos 3 meses y prioriza el pago de deudas de alto costo."
    ]
    
    consejos_estable = [
        "Diseña un plan financiero trimestral para auditar posibles desviaciones en tus categorías de gasto.",
        "Automatiza una transferencia fija a ahorro y explora instrumentos de renta fija de bajo riesgo."
    ]

    consejos_excelentes = [
        "Diversifica tus inversiones en portafolios mixtos internacionales y define metas patrimoniales de largo plazo.",
        "Evalúa la adquisición de activos generadores de flujos de caja pasivos (bienes raíces o fondos indexados)."
    ]

    if financial_profile == "Crítico":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=0,
            titulo="Intervención urgente de tus finanzas",
            explicacion="El modelo detectó una combinación crítica de indicadores de vulnerabilidad económica severa.",
            accion="Considera buscar asesoría financiera profesional, renegocia plazos de deudas y frena cualquier gasto opcional.",
            impacto="Alto",
            score=0.98,
        )

    elif financial_profile == "En riesgo":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=1,
            titulo="Plan de acción correctivo integral",
            explicacion="Tu perfil actual muestra desequilibrios importantes entre tus pasivos y tu capacidad real de ahorro.",
            accion=random.choice(consejos_riesgo),
            impacto="Alto",
            score=0.82,
        )

    elif financial_profile == "En observación":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=2,
            titulo="Monitoreo activo de hábitos de consumo",
            explicacion="Te encuentras en una zona de transición; un ajuste menor en tus gastos puede mejorar notablemente tu estabilidad.",
            accion="Lleva un registro diario de cada pequeño gasto durante las siguientes dos semanas para identificar patrones.",
            impacto="Medio",
            score=0.58,
        )

    elif financial_profile == "Estable":
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=3,
            titulo="Impulsa tu estabilidad al siguiente nivel",
            explicacion="Tus finanzas están equilibradas y sin riesgos inminentes, listas para potenciar tu crecimiento patrimonial.",
            accion=random.choice(consejos_estable),
            impacto="Medio",
            score=0.48,
        )

    elif financial_profile in ["Saludable", "Excelente"]:
        return Recommendation(
            categoria="Perfil financiero",
            prioridad=4,
            titulo="Estrategia avanzada de crecimiento patrimonial",
            explicacion=f"Posees un perfil '{financial_profile}' sólido respaldado por excelentes bases de disciplina económica.",
            accion=random.choice(consejos_excelentes),
            impacto="Bajo",
            score=0.25,
        )

    return None


def evaluate_confidence(probability):
    """
    Evalúa la certeza analítica del modelo de Machine Learning.
    """
    if probability is None or probability >= 0.60:
        return None

    return Recommendation(
        categoria="Confianza del modelo",
        prioridad=4,
        titulo="Auditoría de consistencia de datos",
        explicacion=f"El nivel de certidumbre analítica del modelo fue del {probability * 100:.0f}%.",
        accion="Verifica que los montos de pasivos e ingresos reportados reflejen fielmente tu flujo real para minimizar sesgos predictivos.",
        impacto="Informativo",
        score=probability,
    )