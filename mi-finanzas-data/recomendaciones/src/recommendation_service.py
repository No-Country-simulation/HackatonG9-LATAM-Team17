"""
recommendation_service.py

Servicio de integración entre el modelo de Machine Learning
y el motor de recomendaciones.

Autor: Mauricio Medina
"""

from .recommendation_engine import RecommendationEngine
from .recommendation_serializer import RecommendationSerializer


class RecommendationService:

    def __init__(self):
        self.engine = RecommendationEngine()

    def analyze(
        self,
        financial_profile: str,
        probability: float,
        financial_data: dict
    ):
        """
        Ejecuta el flujo completo de recomendaciones.
        """

        recommendations = self.engine.generate(
            financial_profile,
            financial_data,
            probability
        )

        return RecommendationSerializer.serialize(
            financial_profile,
            probability,
            recommendations
        )