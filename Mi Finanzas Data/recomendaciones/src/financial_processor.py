"""
financial_processor.py - Procesamiento de Machine Learning y reglas de perfil
"""
import joblib
from pathlib import Path
import pandas as pd
from clasificador.contrato_json import clasificar_payload
from .profile_flexibility import flexibilizar_perfil_financiero

RAIZ = Path(__file__).resolve().parent.parent.parent
MODELO_CLASIFICADOR = joblib.load(RAIZ / "modelos" / "clasificador_gastos.pkl")

try:
    MODELO_PERFIL = joblib.load(RAIZ / "modelos" / "perfil_financiero.pkl")
except Exception:
    MODELO_PERFIL = None

MAPEO_NOMBRES_CATEGORIAS = {
    "TRANSPORTE": "Transporte",
    "ALIMENTACION": "Alimentación",
    "OCIO": "Ocio",
    "VIVIENDA": "Vivienda",
    "SERVICIOS": "Servicios",
    "SALUD": "Salud",
    "EDUCACION": "Educación",
    "SUSCRIPCIONES": "Suscripciones",
    "INGRESOS": "Ingresos",
    "OTROS": "Otros",
    "GASTOS_HORMIGA": "Gastos Hormiga",
    "APORTE_INVERSIONES": "Aporte Inversiones"
}

def procesar_transacciones(transacciones):
    resumen_gastos = {}
    confianzas_cat = []
    
    try:
        payload_dict = {
            "transacciones": [
                {"descripcion": t.descripcion, "valor": t.valor, "fecha": "2026-08-12"}
                for t in transacciones
            ]
        }
        
        resultado_clasificacion = clasificar_payload(payload_dict, MODELO_CLASIFICADOR)
        
        for original_t, clasif_t in zip(transacciones, resultado_clasificacion.get("transacciones", [])):
            categoria_raw = str(clasif_t.get("categoria", "OTROS")).strip().upper()
            categoria_limpia = MAPEO_NOMBRES_CATEGORIAS.get(categoria_raw, categoria_raw.replace("_", " ").title())
            confianza = float(clasif_t.get("confiabilidad", 0.90))
            
            resumen_gastos[categoria_limpia] = resumen_gastos.get(categoria_limpia, 0.0) + float(original_t.valor)
            confianzas_cat.append(confianza)
            
    except Exception as e:
        print(f"⚠️ Error procesando clasificación: {e}")
        for t in transacciones:
            resumen_gastos["Otros"] = resumen_gastos.get("Otros", 0.0) + float(t.valor)
            confianzas_cat.append(0.80)
            
    prob_cat_promedio = sum(confianzas_cat) / len(confianzas_cat) if confianzas_cat else 0.90
    return resumen_gastos, prob_cat_promedio


def predecir_y_flexibilizar_perfil(payload):
    perfil_predicho = "Estable"
    prob_perfil = 0.85
    
    relacion_deuda = float(payload.deuda_total / payload.ingreso_mensual if payload.ingreso_mensual > 0 else 0.0)
    ahorro_calculado = float(payload.ingreso_mensual - payload.pago_mensual_deuda)
    meses_reserva_calc = float(payload.fondo_emergencia / (payload.deuda_total if payload.deuda_total > 0 else 1.0))

    if MODELO_PERFIL is not None:
        try:
            datos_df = pd.DataFrame([{
                "ingreso_mensual": float(payload.ingreso_mensual),
                "gasto_mensual_total": float(payload.deuda_total),
                "tasa_ahorro": 0.15,
                "objetivo_presupuesto": float(payload.objetivo_presupuesto),
                "relacion_deuda_ingreso": relacion_deuda,
                "pago_prestamo": float(payload.pago_mensual_deuda),
                "monto_inversion": float(payload.monto_inversion),
                "servicios_suscripción": float(payload.servicios_suscripción),
                "fondo_emergencia": float(payload.fondo_emergencia),
                "cantidad_transacciones": int(len(payload.transacciones)),
                "gastos_discrecionales": 0.0,
                "gastos_esenciales": 0.0,
                "tipo_ingreso": "Salario",
                "alquiler_o_hipoteca": 0.0,
                "estado_flujo_caja": "Estable",
                "nivel_estres_financiero": 1,
                "ahorro_real": ahorro_calculado
            }])
            perfil_predicho = str(MODELO_PERFIL.predict(datos_df)[0])
            prob_perfil = float(MODELO_PERFIL.predict_proba(datos_df).max())
        except Exception:
            if payload.deuda_total > payload.ingreso_mensual:
                perfil_predicho = "En riesgo"
            else:
                perfil_predicho = "Estable"

    financial_data_dict = {
        "ingreso_mensual": payload.ingreso_mensual,
        "gasto_mensual_total": payload.deuda_total,
        "tasa_ahorro": 0.15,
        "objetivo_presupuesto": payload.objetivo_presupuesto,
        "deuda_total": payload.deuda_total,
        "pago_prestamo": payload.pago_mensual_deuda,
        "monto_inversion": payload.monto_inversion,
        "servicios_suscripción": payload.servicios_suscripción,
        "fondo_emergencia": payload.fondo_emergencia,
        "ahorro_real": ahorro_calculado,
        "relacion_deuda_ingreso": relacion_deuda,
        "meses_reserva": meses_reserva_calc
    }

    perfil_final = flexibilizar_perfil_financiero(financial_data_dict, perfil_predicho, prob_perfil)
    return perfil_final, prob_perfil, financial_data_dict