## ADDED Requirements

### Requirement: Generación de Análisis vía API Backend
El sistema DEBE invocar el endpoint `POST /api/v1/finanzas/analizar` al enviar el formulario para procesar el reporte de salud financiera, mapeando correctamente la carga de datos.

#### Scenario: Petición Exitosa al Motor Analítico
- **GIVEN** que el usuario ha llenado los campos y subido transacciones
- **WHEN** hace clic en generar análisis
- **THEN** el sistema calcula `nivel_endeudamiento` y envía todos los datos en formato JSON a `/api/v1/finanzas/analizar`, enviando el valor ingresado en `monto_inversion`.
- **THEN** al recibir un `200 OK`, el sistema mapea la propiedad `datos_analisis` de la respuesta a un objeto `ReporteAnalisis` local.
- **THEN** el sistema invoca la función `onAnalysisComplete` con este reporte y la UI avanza.

#### Scenario: Falla de Red o Error del API
- **WHEN** el backend responde con un error o hay falla de red
- **THEN** el sistema atrapa el error y despliega el mensaje "Ocurrió un inconveniente al procesar. Reintentando con el motor analítico local..." 
- **THEN** tras una breve espera, genera un reporte local simulado (fallback actual) garantizando continuidad.

### Requirement: Nomenclatura Estricta al Español
- El sistema DEBE declarar el estado interno del componente en español usando variables como `ingresoMensual` y `deudaTotal` en vez de variables en inglés.
