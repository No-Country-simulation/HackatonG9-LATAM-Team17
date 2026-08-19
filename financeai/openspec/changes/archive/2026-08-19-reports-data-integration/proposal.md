## Why
El componente `ReportsView.tsx` actualmente utiliza datos "duros" (hardcoded) para la distribución de categorías y las tarjetas de métricas secundarias (Ahorro Total, Obj. Presupuesto, Suscripciones, Fondo Emergencia). Aunque el componente ya recibe como propiedades (`props`) los objetos `report` (de tipo `ReporteAnalisis`, originado directa o indirectamente por los endpoints del backend como `POST /api/v1/finanzas/analizar` o `GET /api/v1/finanzas/historial`) y `userProfile`, no los está utilizando plenamente. Además, el componente cuenta con variables de estado en inglés (`selectedPeriod`, `isExporting`, etc.), lo que viola la regla del proyecto de mantener la nomenclatura en español.

## User Review Required
**⚠️ ADVERTENCIA: Mapeo de datos dinámicos**
- Se reemplazarán las categorías hardcodeadas por `report.distribucionCategorias` que proviene de la estructura devuelta por los endpoints del backend (`datos_analisis`).
- Las 4 tarjetas métricas ("Ahorro Total", "Obj. Presupuesto", "Suscripciones", "Fondo Emergencia") tomarán sus valores directamente de `userProfile` (el cual corresponde a los datos enviados y almacenados en las sesiones del backend/frontend) y del cálculo dinámico según corresponda (ej. formato de moneda).
- ¿Apruebas este enfoque donde mapeamos estrictamente a las propiedades ya inyectadas por el endpoint en lugar de realizar una llamada HTTP directa dentro de esta vista (dado que es un componente de presentación pura)?

## What Changes
- **Nomenclatura (Español):** 
  - `selectedPeriod` -> `periodoSeleccionado`
  - `isExporting` -> `estaExportando`
  - `exportSuccess` -> `exportacionExitosa`
  - `handleExportPDF` -> `manejarExportacionPdf`
- **Mapeo de Datos:** 
  - Eliminar el arreglo `categories` hardcodeado y utilizar `report.distribucionCategorias` para la gráfica de barras y listado.
  - Actualizar las métricas estáticas usando `userProfile.budgetGoal`, `userProfile.subscriptionsCount` y `userProfile.emergencyFund`.
- **Diseño Conservado:**
  - El mapeo reemplazará los textos de forma dinámica respetando el 100% de la jerarquía visual, las clases de TailwindCSS, colores y el diseño existente, tal como se solicitó.

## Capabilities
### Modified Capabilities
- `informes-data-mapping`: Capacidad para inyectar correctamente la estructura de análisis devuelta por los endpoints dentro del componente de reporte, mostrándola visualmente.

## Impact
- `src/components/ReportsView.tsx`: Cambios limitados al uso de estado en español y a la lectura de propiedades (`props.report`, `props.userProfile`). No se alterará el CSS.
