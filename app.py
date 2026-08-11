from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.financial_analysis_pipeline import FinancialAnalysisPipeline

app = FastAPI(
    title="Financial Analysis API",
    version="1.0.0",
    description="Hackathon Oracle + Alura"
)

# Habilitar CORS para permitir peticiones desde la interfaz web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Se carga una sola vez al iniciar la aplicación
pipeline = FinancialAnalysisPipeline("modelos")

@app.get("/")
def home():
    return {
        "mensaje": "Financial Analysis API funcionando"
    }

@app.post("/analisis-financiero")
def analizar(request: dict):
    resultado = pipeline.run(
        transacciones=request["transacciones"],
        ingreso_mensual=request["ingreso_mensual"],
        deuda_total=request["deuda_total"],
        objetivo_presupuesto=request["objetivo_presupuesto"],
        pago_prestamo=request["pago_prestamo"],
        servicios_suscripcion=request["servicios_suscripcion"],
        fondo_emergencia=request["fondo_emergencia"],
        monto_inversion=request["monto_inversion"]
    )
    return resultado

@app.post("/simular-ahorro")
def simular_ahorro(request: dict):
    ingreso = request.get("ingreso_mensual", 0)
    meta_ahorro = request.get("meta_ahorro", 0)
    ahorro_actual = request.get("fondo_emergencia", 0)
    
    transacciones = request.get("transacciones", [])
    total_gastos = sum(t.get("valor", 0) for t in transacciones if t.get("categoria") != "Ingresos")
    
    ahorro_mensual_estimado = ingreso - total_gastos
    
    if ahorro_mensual_estimado <= 0:
        meses_para_meta = "Inalcanzable con los gastos actuales"
    else:
        dinero_faltante = max(0, meta_ahorro - ahorro_actual)
        meses_para_meta = round(dinero_faltante / ahorro_mensual_estimado, 1)

    return {
        "ingreso_mensual": ingreso,
        "gastos_totales": total_gastos,
        "capacidad_ahorro_mensual": ahorro_mensual_estimado,
        "meta_ahorro": meta_ahorro,
        "meses_estimados_para_meta": meses_para_meta,
        "mensaje": f"A este ritmo, te tomará aproximadamente {meses_para_meta} meses alcanzar tu meta de ahorro."
    }