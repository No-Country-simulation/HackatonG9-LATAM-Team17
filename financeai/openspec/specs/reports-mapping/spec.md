## ADDED Requirements

### Requirement: Mapeo de Datos Dinámicos en Componente Visual
El sistema DEBE pintar dinámicamente las listas de distribuciones, etiquetas y tarjetas usando únicamente la propiedad `report` y `userProfile` (proveniente del backend) reemplazando la información en código duro.

#### Scenario: Visualización de Reporte Completo
- **GIVEN** que el componente `ReportsView` es instanciado con un objeto `report` válido y un `userProfile`
- **WHEN** la UI procesa el bloque "Distribución de Gastos"
- **THEN** la gráfica de barras multicromática y el listado de leyenda se calculan iterando sobre `report.distribucionCategorias`
- **THEN** las métricas de "Obj. Presupuesto", "Suscripciones" y "Fondo Emergencia" se muestran extrayendo los datos de `userProfile` con su correspondiente formato monetario de ser el caso.

#### Scenario: Traducción de Nomenclatura del Módulo Informes
- **GIVEN** que existen variables locales de estado en inglés en el componente `ReportsView.tsx`
- **WHEN** se revisan las definiciones
- **THEN** se DEBEN renombrar a sus equivalentes `periodoSeleccionado`, `estaExportando`, `exportacionExitosa` y `manejarExportacionPdf` sin afectar su funcionalidad original.

### Requirement: Mapeo de Respuesta del Backend a Reporte Analisis
El sistema DEBE transformar la respuesta estructurada obtenida de la API `/api/v1/finanzas/analizar` y convertirla al modelo de datos requerido por la interfaz de usuario de frontend `ReporteAnalisis`.

#### Scenario: Mapeo Exitoso tras recibir una Respuesta Válida
- **WHEN** el backend responde exitosamente a una petición en `/api/v1/finanzas/analizar`
- **THEN** el frontend lee los campos raíz de la respuesta (`perfil_financiero`, `probabilidad`, `resumen_gastos` y `recomendaciones`)
- **AND** calcula el campo `totalGastado` sumando los montos dentro de `resumen_gastos`
- **AND** calcula el `puntajeSalud` multiplicando `probabilidad` por 100
- **AND** construye la estructura necesaria para las recomendaciones encapsulando los strings que envía el backend dentro de la estructura enriquecida (título genérico y descripción como string plano).
