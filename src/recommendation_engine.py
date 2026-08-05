"""
recommendation_engine.py

Motor principal de recomendaciones financieras.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from .financial_data_adapter import adapt
from .recommendation_rules import (
    evaluate_savings_rate,
    evaluate_debt_ratio,
    evaluate_emergency_fund,
    evaluate_cash_flow,
    evaluate_subscriptions,
    evaluate_financial_profile,
    evaluate_confidence,
)


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

    def generate(self, financial_profile: str, financial_data: dict, probability: float = None):
        """
        Genera recomendaciones según el perfil financiero.

        Parameters
        ----------
        financial_profile : str
            Perfil financiero generado por el modelo de Machine Learning.
            Una de: "Excelente", "Saludable", "Estable",
            "En observación", "En riesgo", "Crítico".

        financial_data : dict
            Variables financieras del usuario, en el formato producido
            por `generar_caracteristicas_usuario` (Natalia). No es
            necesario adaptarlas antes de llamar a este método: el
            engine aplica `financial_data_adapter.adapt()`
            internamente.

        probability : float, optional
            Probabilidad/confianza del modelo para la clase predicha.
            Si se provee y es baja, se agrega una recomendación
            informativa invitando a verificar los datos.

        Returns
        -------
        list[Recommendation]
            Lista de recomendaciones generadas, ordenadas por
            prioridad (0 = más urgente) y, en caso de empate, por
            score descendente.
        """

        # Reiniciar la lista de recomendaciones
        self.recommendations = []

        # Normalizar nombres de campos y calcular variables derivadas
        # (meses_reserva, ratio_suscripciones, ahorro_real de respaldo)
        financial_data = adapt(financial_data)

        # ============================
        # Regla 1: Ahorro
        # ============================
        recommendation = evaluate_savings_rate(financial_data)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 2: Endeudamiento
        # ============================
        recommendation = evaluate_debt_ratio(financial_data)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 3: Fondo de emergencia
        # ============================
        recommendation = evaluate_emergency_fund(financial_data)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 4: Flujo de caja
        # ============================
        recommendation = evaluate_cash_flow(financial_data)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 5: Gastos recurrentes / suscripciones
        # ============================
        recommendation = evaluate_subscriptions(financial_data)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 6: Perfil financiero
        # ============================
        recommendation = evaluate_financial_profile(financial_profile)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Regla 7: Confianza del modelo
        # ============================
        recommendation = evaluate_confidence(probability)

        if recommendation:
            self.recommendations.append(recommendation)

        # ============================
        # Ordenar por prioridad y, en caso de empate, por score
        # descendente (más importante primero)
        # ============================
        self.recommendations.sort(
            key=lambda recommendation: (recommendation.prioridad, -recommendation.score)
        )

        return self.recommendations