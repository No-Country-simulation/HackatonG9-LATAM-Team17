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
