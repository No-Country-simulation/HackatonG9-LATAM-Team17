"""
profile_flexibility.py
Capa de negocio para flexibilizar y ajustar las etiquetas del modelo de ML.
"""

def flexibilizar_perfil_financiero(financial_data: dict, perfil_ml: str, probabilidad: float) -> str:
    ingreso = financial_data.get("ingreso_mensual", 0) or 0
    ahorro_real = financial_data.get("ahorro_real", 0) or 0
    tasa_ahorro = financial_data.get("tasa_ahorro", 0) or 0
    debt_ratio = financial_data.get("relacion_deuda_ingreso", 0) or 0
    meses_reserva = financial_data.get("meses_reserva", 0) or 0

    if probabilidad < 0.55:
        if debt_ratio > 0.50 or ahorro_real < 0:
            return "Crítico"
        elif debt_ratio > 0.40 or meses_reserva < 1:
            return "En riesgo"
        elif tasa_ahorro >= 0.20 and meses_reserva >= 6:
            return "Excelente"
        elif tasa_ahorro >= 0.10:
            return "Estable"

    if perfil_ml == "En riesgo" and debt_ratio <= 0.40 and meses_reserva >= 2:
        return "En observación"

    if perfil_ml == "Estable":
        if tasa_ahorro >= 0.25 and meses_reserva >= 6 and debt_ratio == 0:
            return "Excelente"
        elif tasa_ahorro >= 0.15 and meses_reserva >= 3:
            return "Saludable"

    return perfil_ml