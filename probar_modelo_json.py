"""Prueba directa del modelo usando archivos JSON.

En Visual Studio Code:
1. Edita ``ejemplos/entrada_transacciones.json``.
2. Abre este archivo.
3. Presiona el boton "Run Python File" (triangulo de la esquina superior).

No requiere argumentos de terminal.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


RAIZ_PROYECTO = Path(__file__).resolve().parent
ARCHIVO_MODELO = RAIZ_PROYECTO / "modelos" / "clasificador_gastos.pkl"
ARCHIVO_ENTRADA = RAIZ_PROYECTO / "ejemplos" / "entrada_transacciones.json"
ARCHIVO_SALIDA = RAIZ_PROYECTO / "ejemplos" / "salida_transacciones.json"
PYTHON_PROYECTO = RAIZ_PROYECTO / ".venv_hackathon" / "Scripts" / "python.exe"


def _usar_entorno_del_proyecto() -> None:
    """Evita el error de sklearn al pulsar Run con el Python global de VS Code."""

    if PYTHON_PROYECTO.exists() and Path(sys.executable).resolve() != PYTHON_PROYECTO.resolve():
        entorno = os.environ.copy()
        entorno.pop("PYTHONHOME", None)
        entorno.pop("PYTHONPATH", None)
        entorno.pop("VIRTUAL_ENV", None)
        entorno["VIRTUAL_ENV"] = str(PYTHON_PROYECTO.parent.parent)
        proceso = subprocess.run(
            [str(PYTHON_PROYECTO), str(Path(__file__).resolve())],
            cwd=RAIZ_PROYECTO,
            env=entorno,
            check=False,
        )
        raise SystemExit(proceso.returncode)


_usar_entorno_del_proyecto()

try:
    from clasificador import cargar_modelo, clasificar_payload
except ModuleNotFoundError as error:
    if error.name in {"sklearn", "numpy", "pandas", "scipy"}:
        raise ModuleNotFoundError(
            "Faltan las dependencias de Machine Learning. Crea .venv e instala "
            "requirements.txt como indica el README."
        ) from error
    raise


def probar_modelo() -> dict[str, object]:
    """Carga el PKL, clasifica el JSON de entrada y guarda el resultado."""

    if not ARCHIVO_MODELO.exists():
        raise FileNotFoundError(f"No se encontro el modelo: {ARCHIVO_MODELO}")
    if not ARCHIVO_ENTRADA.exists():
        raise FileNotFoundError(f"No se encontro el JSON de entrada: {ARCHIVO_ENTRADA}")

    with ARCHIVO_ENTRADA.open("r", encoding="utf-8-sig") as archivo:
        entrada = json.load(archivo)

    modelo = cargar_modelo(ARCHIVO_MODELO)
    resultado = clasificar_payload(entrada, modelo)

    ARCHIVO_SALIDA.write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return resultado


if __name__ == "__main__":
    salida = probar_modelo()
    print("\nCLASIFICACION COMPLETADA\n")
    print(json.dumps(salida, ensure_ascii=False, indent=2))
    print(f"\nResultado guardado en:\n{ARCHIVO_SALIDA}")
