"""
main.py - Punto de entrada principal de FastAPI
"""
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from recomendaciones.src.api_router import router as api_router

app = FastAPI(
    title="API de Análisis y Recomendaciones Financieras",
    version="3.0.0"
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("❌ ERROR 422 DETALLADO:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": "Revisa la terminal de Python para ver el detalle exacto"}
    )

app.include_router(api_router, prefix="/api/v1")