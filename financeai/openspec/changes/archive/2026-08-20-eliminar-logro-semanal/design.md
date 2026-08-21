## Context

El tipo `ReporteAnalisis` en `src/types.ts` contenía una propiedad `logroSemanal` que se definió como obligatoria. El backend no devuelve este campo en sus endpoints, lo que causaba incompatibilidad con la UI si se instanciaba este tipo localmente (por ejemplo al mapear transacciones sueltas en la vista de historial o si el compilador analizaba la recepción del payload del backend).

## Goals / Non-Goals

**Goals:**
- Asegurar que la interfaz `ReporteAnalisis` sea estrictamente compatible con la estructura que provee el backend.
- Eliminar la necesidad de mockear datos de "logros semanales" o "rachas ahorrativas" en el frontend cuando se arman arreglos locales.

**Non-Goals:**
- Reemplazar la métrica visual del "logroSemanal" en `ReportsView.tsx` o `HistoryView.tsx` con un equivalente, si existía alguna interfaz que dependiera de ella, se retirará por completo.
- Modificar el backend para que devuelva esta métrica.

## Decisions

- **Eliminar `logroSemanal` de `types.ts`**: Remoción total, reduciendo la fricción y dejando los tipos más cercanos a la realidad.
- **Purgar referencias en la UI**: Modificar componentes de React que pasen el campo o lo intenten renderizar (p.ej. la inyección de historial simulada en `HistoryView.tsx`).

## Risks / Trade-offs

- **[Risk]** Que algún widget existente (como un cuadro de "Racha Ahorrativa") se rompa o se vea vacío al eliminar sus datos subyacentes.
  - **Mitigación**: Buscar todas las menciones y remover el bloque de interfaz asociado por completo, asegurando que el diseño de Tailwind siga siendo armonioso en lugar de dejar espacios vacíos.
