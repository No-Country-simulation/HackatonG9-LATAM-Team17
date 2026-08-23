"""
api_router.py - Enrutador de endpoints FastAPI
"""
from fastapi import APIRouter
from .schemas import AnalisisInputDTO, RespuestaPythonDTO
from .financial_processor import procesar_transacciones, predecir_y_flexibilizar_perfil
from .recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()

@router.post("/analizar-perfil", response_model=RespuestaPythonDTO)
def analizar_perfil(payload: AnalisisInputDTO):
    print(f"\n--- [PYTHON ORQUESTADOR] Procesando análisis financiero completo ---")
    
    resumen_gastos, prob_cat_promedio = procesar_transacciones(payload.transacciones)
    perfil_final, prob_perfil, financial_data_dict = predecir_y_flexibilizar_perfil(payload)

    resultado_recomendaciones = recommendation_service.analyze(
        financial_profile=perfil_final,
        probability=prob_perfil,
        financial_data=financial_data_dict
    )
    
    lista_recs_raw = resultado_recomendaciones.get("recomendaciones", [])
    lista_textos_recomendaciones = [
        f"{r.get('titulo', '')}: {r.get('accion', '')}" for r in lista_recs_raw
    ]
    
    scores = [r.get("score", 0.8) for r in lista_recs_raw if isinstance(r.get("score"), (int, float))]
    prob_recomendaciones = sum(scores) / len(scores) if scores else 0.80

    return {
        "probabilidad_categoria": float(prob_cat_promedio),
        "probabilidad_perfil_financiero": float(prob_perfil),
        "probabilidad_recomendaciones": float(prob_recomendaciones),
        "perfil_financiero": perfil_final,
        "resumen_gastos": resumen_gastos,
        "recomendaciones": lista_textos_recomendaciones
    }