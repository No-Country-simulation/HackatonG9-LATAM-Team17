"""
recommendation_serializer.py

Convierte las recomendaciones en un formato JSON.

Autor: Mauricio Medina
"""


class RecommendationSerializer:

    @staticmethod
    def serialize(profile, probability, recommendations):

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
                    "score": recommendation.score
                }
                for recommendation in recommendations
            ]
        }
