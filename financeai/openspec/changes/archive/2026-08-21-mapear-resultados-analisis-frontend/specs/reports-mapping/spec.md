## ADDED Requirements

### Requirement: Mapeo de Respuesta del Backend a Reporte Analisis
El sistema DEBE transformar la respuesta estructurada obtenida de la API `/api/v1/finanzas/analizar` y convertirla al modelo de datos requerido por la interfaz de usuario de frontend `ReporteAnalisis`.

#### Scenario: Mapeo Exitoso tras recibir una Respuesta Válida
- **WHEN** el backend responde exitosamente a una petición en `/api/v1/finanzas/analizar`
- **THEN** el frontend lee los campos raíz de la respuesta (`perfil_financiero`, `probabilidad`, `resumen_gastos` y `recomendaciones`)
- **AND** calcula el campo `totalGastado` sumando los montos dentro de `resumen_gastos`
- **AND** calcula el `puntajeSalud` multiplicando `probabilidad` por 100
- **AND** construye la estructura necesaria para las recomendaciones encapsulando los strings que envía el backend dentro de la estructura enriquecida (título genérico y descripción como string plano).
