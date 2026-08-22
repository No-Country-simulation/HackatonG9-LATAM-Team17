## Why

El modelo de Inteligencia Artificial que procesa las transacciones puede generar un número dinámico e impredecible de categorías de gastos (ej. "Mascotas", "Suscripciones Digitales", etc.). El código actual depende de diccionarios de colores quemados (`hardcoded`) que limitan la paleta a 7-8 categorías fijas, lo que provoca colores predeterminados grises o fallos visuales cuando surgen categorías nuevas. Se necesita un asignador de colores dinámico que preserve la estética "premium" de la aplicación.

## What Changes

- Implementación de un Gestor de Colores (`colorManager.ts`) que maneja una paleta base premium y asigna dinámicamente colores a nuevas categorías sin repetir.
- Si las categorías superan los colores base, se generarán nuevos colores de alto contraste usando la proporción áurea (Golden Ratio).
- Refactorización de `DashboardView.tsx` y `ReportsView.tsx` para usar este gestor en vez de diccionarios quemados en el código.
- Refactorización de `mapeadores.ts` para que también utilice el `colorManager.ts` y mantenga un único origen de verdad para los colores.

## Capabilities

### New Capabilities
- `colores-categorias-dinamicos`: Asignación y persistencia en sesión de colores únicos y dinámicos para categorías de gasto.

### Modified Capabilities
- Ninguna

## Impact

- `src/utils/colorManager.ts` (NUEVO)
- `src/utils/mapeadores.ts`
- `src/components/DashboardView.tsx`
- `src/components/ReportsView.tsx`
