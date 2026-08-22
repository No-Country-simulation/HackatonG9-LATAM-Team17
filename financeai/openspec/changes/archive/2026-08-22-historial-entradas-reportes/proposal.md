## Why

Actualmente, cuando un usuario genera un nuevo análisis financiero, introduce parámetros específicos (Objetivo de Presupuesto, Suscripciones y Fondo de Emergencia). Sin embargo, el objeto final del reporte generado no retiene estos valores introducidos. Al visualizar un análisis pasado en la vista de reportes (`ReportsView`), el componente lee globalmente esos valores directamente desde el perfil actual del usuario (`userProfile`). Esto causa un problema de pérdida de contexto histórico, ya que reportes generados hace meses mostrarían la configuración actual del usuario y no la que poseía al momento del reporte.

## What Changes

- Modificación de la construcción del objeto `report` en el componente `NewAnalysisView`. Se utilizará la propiedad nativa `entradas` de la interfaz `ReporteAnalisis` para inyectar una instantánea (snapshot) de los datos del momento (Objetivo de Presupuesto, Suscripciones, Fondo Emergencia, etc).
- Refactorización de las tarjetas de métricas en `ReportsView` (Cards secundarias y principales según amerite). Se programarán para leer estos datos con la prioridad: `report.entradas.campo || userProfile.campo`. Esto asegura que los reportes nuevos posean inmutabilidad histórica, y los antiguos mantengan funcionalidad de "fallback" (usando el perfil general actual).

## Capabilities

### New Capabilities
- `snapshot-parametros-reporte`: Captura y persistencia de los valores de entrada de un análisis financiero (Obj. Presupuesto, Suscripciones, Fondo de Emergencia) en el payload mismo del reporte para su posterior revisión inmutable en el historial.

### Modified Capabilities


## Impact

- Modificación directa en `src/components/NewAnalysisView.tsx` (agregando campos `entradas` al objeto).
- Modificación directa en `src/components/ReportsView.tsx` (modificando la lectura para apuntar a `report.entradas` por defecto).
- **No impacta a la API del backend** porque es lógica interna de persistencia de datos en el cliente (react-router state, arrays de sesión, o persistencia temporal). Todos los cambios son 100% compatibles con la restricción de diseño de Frontend local.
