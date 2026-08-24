"""
recommendation_models.py

Modelos de datos utilizados por el motor
de recomendaciones financieras.

Autor: Mauricio Medina
Proyecto: Hackathon Oracle + Alura
"""

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Recommendation:
    """
    Representa una recomendación financiera generada
    por el Recommendation Engine.
    """

    categoria: str
    prioridad: int
    titulo: str
    explicacion: str
    accion: str

    # Nivel de impacto de la recomendación ("Alto", "Medio", "Bajo",
    # "Informativo" para notas que no son una acción propiamente dicha).
    impacto: str = "Medio"

    # Puntaje de importancia (0.0 - 1.0). Se usa como criterio de
    # desempate cuando dos recomendaciones comparten la misma
    # prioridad.
    score: float = 0.50

    # Fecha de generación
    fecha: str = field(
        default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )