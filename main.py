from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Python Data Science API")

class TransaccionDTO(BaseModel):
    descripcion: str
    valor: float

class AnalisisInputDTO(BaseModel):
    ingresoMensual: float
    nivelEndeudamiento: float
    frecuenciaAhorro: str
    transacciones: List[TransaccionDTO]

class RespuestaPythonDTO(BaseModel):
    probabilidad: float
    perfil_financiero: str
    clasificacion_gastos: Dict[str, str]
    recomendaciones: List[str]

@app.post("/api/v1/analizar-perfil", response_model=RespuestaPythonDTO)
def analizar_perfil(payload: AnalisisInputDTO):
    print(f"\n--- [PYTHON NLP/IA] Clasificando transacciones recibidas ---")
    
    mapa_categorias = {}
    
    # Clasificación basada en tus 7 categorías principales
    for t in payload.transacciones:
        desc = t.descripcion.lower().strip()
        
        if any(kw in desc for kw in ["almuerzo", "comida", "cena", "mercado", "restaurante", "supermercado"]):
            categoria = "Alimentación"
        elif any(kw in desc for kw in ["gasolina", "moto", "transporte", "pasaje", "carro", "taxi", "peaje", "bus"]):
            categoria = "Transporte"
        elif any(kw in desc for kw in ["facia", "medico", "medicina", "dermatologo", "salud", "farmacia", "hospital", "cita"]):
            categoria = "Salud"
        elif any(kw in desc for kw in ["arriendo", "alquiler", "hipoteca", "mantenimiento", "casa", "apartamento"]):
            categoria = "Vivienda"
        elif any(kw in desc for kw in ["pension", "colegio", "universidad", "curso", "libro", "matricula", "estudio"]):
            categoria = "Educación"
        elif any(kw in desc for kw in ["cine", "bar", "fiesta", "viaje", "juego", "salida", "entretenimiento", "restaurante fin de semana"]):
            categoria = "Ocio"
        elif any(kw in desc for kw in ["luz", "agua", "gas", "internet", "telefono", "servicios", "plan"]):
            categoria = "Servicios"
        else:
            categoria = "Ocio"  # Categoría por defecto si no encaja en las anteriores
            
        mapa_categorias[t.descripcion] = categoria

    return {
        "probabilidad": 0.82,
        "perfil_financiero": "En observación",
        "clasificacion_gastos": mapa_categorias,
        "recomendaciones": [
            "Monitorear los gastos recurrentes de entretenimiento y ocio",
            "Aumentar la reserva financiera mensual"
        ]
    }