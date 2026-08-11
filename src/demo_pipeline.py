import json

from src.financial_analysis_pipeline import FinancialAnalysisPipeline


pipeline = FinancialAnalysisPipeline("modelos")


transacciones = [
    {
        "fecha": "2026-08-01",
        "descripcion": "Pago salario Empresa ABC",
        "categoria": "Ingresos",
        "valor": 4500
    },
    {
        "fecha": "2026-08-02",
        "descripcion": "Supermercado",
        "categoria": "Alimentacion",
        "valor": 650
    },
    {
        "fecha": "2026-08-03",
        "descripcion": "Netflix",
        "categoria": "Ocio",
        "valor": 45
    },
    {
        "fecha": "2026-08-04",
        "descripcion": "Arriendo",
        "categoria": "Vivienda",
        "valor": 1200
    }
]


resultado = pipeline.run(
    transacciones=transacciones,
    ingreso_mensual=4500,
    deuda_total=1200,
    objetivo_presupuesto=4000,
    pago_prestamo=300,
    servicios_suscripcion=2,
    fondo_emergencia=5000,
    monto_inversion=1000
)

print(json.dumps(resultado, indent=4, ensure_ascii=False))