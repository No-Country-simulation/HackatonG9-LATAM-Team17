from src.recommendation_service import RecommendationService

financial_data = {
    "ingreso_mensual": 5000,
    "gasto_mensual_total": 4800,
    "gastos_esenciales": 4000,
    "tasa_ahorro": 0.05,
    "relacion_deuda_ingreso": 0.55,
    "fondo_emergencia": 2000,
    "servicios_suscripcion": 350,
}

service = RecommendationService()

resultado = service.analyze(
    financial_profile="En observación",
    probability=0.58,
    financial_data=financial_data
)

from pprint import pprint
pprint(resultado)