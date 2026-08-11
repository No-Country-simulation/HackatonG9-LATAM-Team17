"""
recommendation_engine.py

Motor principal de recomendaciones financieras.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from .recommendation_models import Recommendation
from .recommendation_rules import (
    evaluate_savings_rate,
    evaluate_debt_ratio,
    evaluate_emergency_fund,
    evaluate_cash_flow,
    evaluate_subscriptions,
    evaluate_financial_profile
)

# Por debajo de este umbral, la confianza del modelo de perfil
# financiero se considera baja y se añade una nota aclaratoria.
CONFIDENCE_THRESHOLD = 0.60


class RecommendationEngine:
    """
    Clase principal encargada de generar recomendaciones
    financieras personalizadas.
    """

    def __init__(self):
        """
        Constructor de la clase.
        """
        self.recommendations = []

    def generate(
        self,
        financial_profile: str,
        financial_data: dict,
        probability: float = None
    ):
        """
        Genera recomendaciones según el perfil financiero.

        Parameters
        ----------
        financial_profile : str
            Perfil financiero generado por el modelo de Machine Learning.
            Una de: Excelente, Saludable, Estable, En observación,
            En riesgo, Crítico.

        financial_data : dict
            Variables financieras del usuario, ya procesadas por
            `FinancialDataMapper` (ver financial_data_mapper.py).

        probability : float, optional
            Probabilidad/confianza con la que el modelo asignó
            `financial_profile`. Si se indica y es menor al umbral
            de confianza, se añade una recomendación adicional
            avisando que el resultado debe tomarse con cautela.

        Returns
        -------
        list[Recommendation]
            Lista de recomendaciones generadas, ordenadas por
            prioridad (y por score como criterio de desempate).
        """

        # Reiniciar la lista de recomendaciones
        self.recommendations = []

        reglas_por_variable = (
            evaluate_savings_rate,
            evaluate_debt_ratio,
            evaluate_emergency_fund,
            evaluate_cash_flow,
            evaluate_subscriptions,
        )

        for regla in reglas_por_variable:
            recommendation = regla(financial_data)

            if recommendation:
                self.recommendations.append(recommendation)

        # ============================
        # Regla: Perfil financiero
        # ============================
        recommendation = evaluate_financial_profile(financial_profile)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Confianza del modelo
        # ============================
        if probability is not None and probability < CONFIDENCE_THRESHOLD:
            self.recommendations.append(
                Recommendation(
                    categoria="Confianza del modelo",
                    prioridad=4,
                    titulo="Resultado con confianza moderada",
                    explicacion=(
                        f"El modelo clasificó tu perfil como "
                        f"'{financial_profile}' con una confianza de "
                        f"{probability * 100:.0f}%, por debajo del umbral "
                        f"recomendado ({CONFIDENCE_THRESHOLD * 100:.0f}%)."
                    ),
                    accion="Registra más transacciones para mejorar la precisión de tu próximo análisis.",
                    impacto="Bajo",
                    score=0.15
                )
            )

        # ============================
        # Ordenar por prioridad y, en caso de empate, por score
        # (score más alto primero: mayor urgencia/relevancia)
        # ============================
        self.recommendations.sort(
            key=lambda recommendation: (recommendation.prioridad, -recommendation.score)
        )

        return self.recommendations
