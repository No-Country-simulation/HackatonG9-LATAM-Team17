"""API publica del clasificador de transacciones financieras."""

from .modelo import ClasificadorGastos, cargar_modelo
from .texto import normalizar_texto
from .contrato_json import clasificar_payload, clasificar_transaccion

__all__ = [
    "ClasificadorGastos",
    "cargar_modelo",
    "clasificar_payload",
    "clasificar_transaccion",
    "normalizar_texto",
]
