## Why

El frontend actualmente tiene tres bugs silenciosos críticos: el historial no se carga al inicio (la API devuelve un objeto paginado pero el código espera un array plano), las recomendaciones históricas llegan como strings pero los componentes esperan objetos, y el botón "Ver detalles" de cada recomendación siempre abre el último análisis en lugar del análisis de origen. Todo esto hace que la sección "Recomendaciones del Experto" del Dashboard sólo muestre las del último análisis generado en sesión, y que el Historial dependa de su propio fetch redundante para funcionar.

## What Changes

- **BREAKING (silent)**: Corrección del parseo de la respuesta paginada en `App.tsx`: leer `data.content` en lugar de `data` directamente al fetchear `/api/v1/finanzas/historial`.
- Centralizar el mapeo del historial en `App.tsx` usando `normalizarPerfil` y el mapeador de recomendaciones, para que todos los componentes reciban datos tipados correctamente.
- Eliminar el fetch redundante en `HistoryView.tsx` y hacer que consuma el prop `analysisHistory` ya normalizado que recibe de `App.tsx`.
- Extender `RecomendacionExtendida` en `DashboardView.tsx` para guardar una referencia al `ReporteAnalisis` de origen, y corregir el botón "Ver detalles" para que abra el análisis correcto.

## Capabilities

### New Capabilities
- `history-data-mapping`: Mapeo centralizado y tipado del historial paginado que llega del backend hacia `ReporteAnalisis[]`, incluyendo normalización de `perfilFinanciero` y conversión de recomendaciones de string a objeto `Recomendacion`.

### Modified Capabilities
- (ninguna a nivel de spec — solo correcciones de implementación)

## Impact

- **`src/App.tsx`**: Corrección del parseo de la respuesta paginada (`data.content`) y aplicación del mapeo completo antes de pasar el historial a los componentes.
- **`src/components/HistoryView.tsx`**: Eliminación del `useEffect` de fetch propio. El componente pasa a ser puramente presentacional respecto al historial.
- **`src/components/DashboardView.tsx`**: Extensión de `RecomendacionExtendida` para incluir el reporte de origen, y corrección del handler `onOpenAnalysisModal` en cada recomendación.
- **`src/utils/mapeadores.ts`**: Posible extracción de función utilitaria para mapear un item crudo del historial a `ReporteAnalisis` (reutilizable entre `App.tsx` y cualquier otro consumidor futuro).
- Sin cambios a endpoints del backend ni a los tipos principales en `src/types.ts`.
