"""
Pruebas del Recommendation Engine.

Autor: Mauricio Medina
"""

import pytest

from src.recommendation_engine import RecommendationEngine
from src.financial_data_mapper import FinancialDataMapper


# ==========================================================
# Datos base reutilizables (esquema real de Natalia)
# ==========================================================

def datos_base(**overrides):
    """
    Devuelve un diccionario de variables financieras con el esquema
    real que produce `generar_caracteristicas_usuario`, permitiendo
    sobrescribir campos puntuales por prueba.
    """
    base = {
        "ingreso_mensual": 5000,
        "gasto_mensual_total": 4800,
        "tasa_ahorro": 0.05,
        "objetivo_presupuesto": 800,
        "relacion_deuda_ingreso": 0.55,
        "pago_prestamo": 400,
        "monto_inversion": 100,
        "servicios_suscripcion": 3,
        "fondo_emergencia": 300,
        "cantidad_transacciones": 10,
        "gastos_discrecionales": 900,
        "gastos_esenciales": 2500,
        "tipo_ingreso": "Salario",
        "alquiler_o_hipoteca": 1200,
        "estado_flujo_caja": "Positivo",
        "nivel_estres_financiero": "Alto",
        "ahorro_real": 200,
    }
    base.update(overrides)
    return base


# ==========================================================
# Caso general (equivalente al test original, con nombres reales)
# ==========================================================

def test_engine_generates_recommendations_for_at_risk_profile():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base())

    recommendations = engine.generate("En observación", financial_data)

    categorias = {r.categoria for r in recommendations}

    assert "Ahorro" in categorias           # tasa_ahorro 0.05 < 0.10
    assert "Endeudamiento" in categorias    # relacion_deuda_ingreso 0.55 > 0.40
    assert "Fondo de emergencia" in categorias  # meses_reserva bajo
    assert "Perfil financiero" in categorias


# ==========================================================
# Cobertura de las 6 clases del modelo de perfil financiero
# ==========================================================

@pytest.mark.parametrize("perfil", [
    "Crítico",
    "En riesgo",
    "En observación",
    "Estable",
    "Saludable",
    "Excelente",
])
def test_every_profile_class_produces_a_recommendation(perfil):
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base())

    recommendations = engine.generate(perfil, financial_data)

    perfil_recs = [r for r in recommendations if r.categoria == "Perfil financiero"]

    assert len(perfil_recs) == 1
    assert perfil_recs[0].titulo != ""


# ==========================================================
# Caso "sano": ninguna regla por variable debería dispararse
# ==========================================================

def test_healthy_user_only_gets_profile_recommendation():
    engine = RecommendationEngine()

    datos_sanos = datos_base(
        tasa_ahorro=0.30,
        relacion_deuda_ingreso=0.15,
        fondo_emergencia=15000,       # cubre varios meses de gastos esenciales
        gastos_esenciales=2500,
        servicios_suscripcion=2,
        ahorro_real=1500,
        ingreso_mensual=5000,
    )

    financial_data = FinancialDataMapper.map(datos_sanos)

    recommendations = engine.generate("Excelente", financial_data)

    categorias = {r.categoria for r in recommendations}

    # Solo debería quedar la recomendación de perfil (tono "mantener /
    # explorar oportunidades"), ninguna alerta por variable individual.
    assert categorias == {"Perfil financiero"}


# ==========================================================
# Casos límite (umbrales exactos)
# ==========================================================

def test_savings_rate_exactly_at_threshold_does_not_trigger():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base(tasa_ahorro=0.10))

    recommendations = engine.generate("Estable", financial_data)

    categorias = {r.categoria for r in recommendations}
    assert "Ahorro" not in categorias


def test_debt_ratio_exactly_at_threshold_does_not_trigger():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base(relacion_deuda_ingreso=0.40))

    recommendations = engine.generate("Estable", financial_data)

    categorias = {r.categoria for r in recommendations}
    assert "Endeudamiento" not in categorias


# ==========================================================
# Regla de suscripciones
# ==========================================================

def test_high_subscription_count_triggers_recommendation():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base(servicios_suscripcion=8))

    recommendations = engine.generate("Estable", financial_data)

    categorias = {r.categoria for r in recommendations}
    assert "Gastos recurrentes" in categorias


def test_low_subscription_count_does_not_trigger():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base(servicios_suscripcion=2))

    recommendations = engine.generate("Estable", financial_data)

    categorias = {r.categoria for r in recommendations}
    assert "Gastos recurrentes" not in categorias


# ==========================================================
# Confianza del modelo
# ==========================================================

def test_low_probability_adds_confidence_warning():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base())

    recommendations = engine.generate(
        "En observación",
        financial_data,
        probability=0.45
    )

    categorias = {r.categoria for r in recommendations}
    assert "Confianza del modelo" in categorias


def test_high_probability_does_not_add_confidence_warning():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base())

    recommendations = engine.generate(
        "En observación",
        financial_data,
        probability=0.95
    )

    categorias = {r.categoria for r in recommendations}
    assert "Confianza del modelo" not in categorias


# ==========================================================
# Orden de las recomendaciones
# ==========================================================

def test_recommendations_are_sorted_by_priority():
    engine = RecommendationEngine()
    financial_data = FinancialDataMapper.map(datos_base())

    recommendations = engine.generate("En riesgo", financial_data, probability=0.5)

    prioridades = [r.prioridad for r in recommendations]
    assert prioridades == sorted(prioridades)
