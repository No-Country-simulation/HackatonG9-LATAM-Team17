"""
Pruebas del Recommendation Engine.

Autor: Mauricio Medina
"""

from src.recommendation_engine import RecommendationEngine


def test_engine_generates_recommendations():

    engine = RecommendationEngine()

    financial_data = {
        "tasa_ahorro": 0.05,
        "nivel_endeudamiento": 0.55,
        "ingreso_mensual": 5000,
        "meses_reserva": 1,
        "gastos_totales": 4800
    }

    profile = "En observación"

    recommendations = engine.generate(
        profile,
        financial_data
    )

    assert len(recommendations) == 5