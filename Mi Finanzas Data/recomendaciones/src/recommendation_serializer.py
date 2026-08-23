"""
recommendation_serializer.py

Convierte las recomendaciones en un formato JSON.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from .recommendation_models import Recommendation


class RecommendationSerializer:
    """
    Convierte el resultado del Recommendation Engine
    a un diccionario listo para ser serializado como JSON.
    """

    @staticmethod
    def serialize(
        profile: str,
        probability: float,
        recommendations: list[Recommendation]
    ) -> dict:

        return {
            "perfil_financiero": profile,
            "probabilidad": probability,
            "recomendaciones": [
                {
                    "categoria": recommendation.categoria,
                    "prioridad": recommendation.prioridad,
                    "titulo": recommendation.titulo,
                    "explicacion": recommendation.explicacion,
                    "accion": recommendation.accion,
                    "impacto": recommendation.impacto,
                    "score": recommendation.score,
                    "fecha": recommendation.fecha
                }
                for recommendation in recommendations
            ]
        }