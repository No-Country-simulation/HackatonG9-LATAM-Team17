"""Adaptador entre el contrato JSON del backend y el clasificador NLP."""

from __future__ import annotations

import math
from datetime import datetime
from typing import Any

from .modelo import ClasificadorGastos
from .texto import normalizar_texto


def etiqueta_api(categoria: str) -> str:
    """Convierte la etiqueta interna a una constante estable para el backend."""

    return normalizar_texto(categoria).replace(" ", "_").upper()


def _validar_transaccion(transaccion: Any, indice: int | None = None) -> None:
    ubicacion = "transaccion" if indice is None else f"transacciones[{indice}]"
    if not isinstance(transaccion, dict):
        raise ValueError(f"{ubicacion} debe ser un objeto JSON")

    faltantes = [campo for campo in ("descripcion", "valor", "fecha") if campo not in transaccion]
    if faltantes:
        raise ValueError(f"Faltan campos en {ubicacion}: {faltantes}")

    descripcion = transaccion["descripcion"]
    if not isinstance(descripcion, str) or not descripcion.strip():
        raise ValueError(f"{ubicacion}.descripcion debe ser un texto no vacio")

    valor = transaccion["valor"]
    if isinstance(valor, bool) or not isinstance(valor, (int, float)) or not math.isfinite(valor):
        raise ValueError(f"{ubicacion}.valor debe ser un numero finito")

    fecha = transaccion["fecha"]
    if not isinstance(fecha, str) or not fecha.strip():
        raise ValueError(f"{ubicacion}.fecha debe ser una fecha ISO-8601")
    try:
        datetime.fromisoformat(fecha.strip().replace("Z", "+00:00"))
    except ValueError as error:
        raise ValueError(f"{ubicacion}.fecha debe usar formato ISO-8601") from error


def clasificar_transaccion(
    transaccion: dict[str, Any], modelo: ClasificadorGastos
) -> dict[str, str | float]:
    """Clasifica solo la descripcion; valor y fecha se validan pero no son features."""

    _validar_transaccion(transaccion)
    resultado = modelo.predecir(transaccion["descripcion"], umbral=0.0)
    return {
        "categoria": etiqueta_api(str(resultado["categoria_modelo"])),
        "confiabilidad": float(resultado["confianza"]),
    }


def clasificar_payload(payload: Any, modelo: ClasificadorGastos) -> dict[str, Any]:
    """Acepta una transaccion individual o un objeto con `transacciones`."""

    if not isinstance(payload, dict):
        raise ValueError("La raiz del JSON debe ser un objeto")

    if "transacciones" not in payload:
        return clasificar_transaccion(payload, modelo)

    transacciones = payload["transacciones"]
    if not isinstance(transacciones, list):
        raise ValueError("transacciones debe ser un arreglo JSON")

    salida: list[dict[str, str | float]] = []
    for indice, transaccion in enumerate(transacciones):
        _validar_transaccion(transaccion, indice)
        resultado = modelo.predecir(transaccion["descripcion"], umbral=0.0)
        salida.append(
            {
                "categoria": etiqueta_api(str(resultado["categoria_modelo"])),
                "confiabilidad": float(resultado["confianza"]),
            }
        )
    return {"transacciones": salida}

