"""
Demo del Recommendation Engine.

Autor: Mauricio Medina
"""

import json

from src.json_loader import JsonLoader
from src.recommendation_service import RecommendationService

# Leer el archivo JSON (esquema real que entrega el pipeline de Natalia)
data = JsonLoader.load("data/sample_user.json")

# Crear el servicio
service = RecommendationService()

# Ejecutar el análisis
result = service.analyze(
    financial_profile=data["perfil_financiero"],
    probability=data["probabilidad"],
    financial_data=data["financial_data"]
)

# Mostrar el resultado
print(json.dumps(result, indent=4, ensure_ascii=False))
