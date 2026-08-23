"""
schemas.py - Contratos de datos (Pydantic DTOs)
"""
from pydantic import BaseModel
from typing import List, Dict, Optional

class TransaccionDTO(BaseModel):
    descripcion: str
    valor: float

class AnalisisInputDTO(BaseModel):
    ingreso_mensual: float
    nivel_endeudamiento: Optional[float] = 0.0  # <-- Ahora es opcional y por defecto 0.0
    frecuencia_ahorro: str
    monto_inversion: float
    deuda_total: float
    objetivo_presupuesto: float
    pago_mensual_deuda: float
    servicios_suscripción: int
    fondo_emergencia: float
    transacciones: List[TransaccionDTO]

class RespuestaPythonDTO(BaseModel):
    probabilidad_categoria: float
    probabilidad_perfil_financiero: float
    probabilidad_recomendaciones: float
    perfil_financiero: str
    resumen_gastos: Dict[str, float]
    recomendaciones: List[str]