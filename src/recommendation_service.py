"""
recommendation_service.py

Servicio de integración entre el modelo de Machine Learning
y el motor de recomendaciones.

Autor: Mauricio Medina
"""

from .financial_data_mapper import FinancialDataMapper
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

        `financial_data` se recibe en el formato que produce el
        pipeline de Natalia (columnas de `generar_caracteristicas_usuario`)
        y se normaliza aquí con `FinancialDataMapper` antes de
        pasarlo al motor de reglas.
        """

        mapped_data = FinancialDataMapper.map(financial_data)

        recommendations = self.engine.generate(
            financial_profile,
            mapped_data,
            probability=probability
        )

        return RecommendationSerializer.serialize(
            financial_profile,
            probability,
            recommendations
        )
