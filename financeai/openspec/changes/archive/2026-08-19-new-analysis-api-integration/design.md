## Context
La vista `NewAnalysisView` permite a los usuarios introducir sus datos financieros y transacciones para que el motor inteligente analice y categorice la salud financiera. El backend posee un endpoint funcional `POST /api/v1/finanzas/analizar` que recibe estos datos y devuelve un análisis. Es vital conectar esta vista usando el endpoint correcto e inyectando las llaves requeridas, además de adaptar la nomenclatura de los componentes de React a español.

## Goals / Non-Goals

**Goals:**
- Traducir todas las variables locales a español.
- Integrar la llamada al endpoint `/api/v1/finanzas/analizar`.
- Mapear los datos de React hacia el DTO esperado en el backend.
- Mapear la respuesta de la API hacia la interfaz local `ReporteAnalisis`.

**Non-Goals:**
- No se modificarán archivos del backend.

## Decisions

**1. Mapeo del Nivel de Endeudamiento (`nivel_endeudamiento`)**
- *Decisión*: Si `ingresoMensual` > 0, calcular `Math.round((deudaTotal / ingresoMensual) * 100)`. De lo contrario enviar `0`.
- *Racional*: Es una métrica requerida por el API. El frontend no lo recibe como un "porcentaje" explícito, pero lo puede inferir de la deuda total y el ingreso mensual declarados en el formulario.

**2. Manejo de Respuesta y Fallbacks**
- *Decisión*: Si el backend devuelve un reporte, se transforma la respuesta (`datos_analisis`) a la interfaz local `ReporteAnalisis`. En caso de error de conexión, se recurre al "fallback" existente para generar un reporte local y no bloquear la experiencia de usuario.
- *Racional*: Mantiene la resiliencia en caso de problemas con el servidor.

**3. Inclusión del Monto de Inversión (`monto_inversion`)**
- *Decisión*: Se añadirá un nuevo campo de estado `montoInversion` en React. En la UI, se renderizará un `input` numérico para "Monto de Inversión ($)" en la tarjeta de "Indicadores Financieros Avanzados". Su valor se enviará al backend, afectando potencialmente las recomendaciones.
- *Racional*: El endpoint lo requiere. Es preferible pedir este dato al usuario (para un análisis más completo) que mandar un 0 estático.

## Estructura de Datos (Mapeo)

### Petición a Enviar
```json
{
  "ingreso_mensual": ingresoMensual,
  "nivel_endeudamiento": nivelEndeudamientoCalculado,
  "frecuencia_ahorro": frecuenciaAhorro.toLowerCase(),
  "monto_inversion": montoInversion,
  "deuda_total": deudaTotal,
  "objetivo_presupuesto": objetivoPresupuesto,
  "pago_mensual_deuda": pagoMensualDeuda,
  "servicios_suscripción": serviciosSuscripcion,
  "fondo_emergencia": fondoEmergencia,
  "transacciones": listaTransacciones.map(t => ({
      "descripcion": t.description,
      "valor": t.amount,
      "fecha_transaccion": t.date + "T00:00:00.000Z"
  }))
}
```
