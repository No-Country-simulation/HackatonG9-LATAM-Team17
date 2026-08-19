## Why

El objetivo es integrar la sección de "Agregar Transacción Rápida" (Quick Add) del `DashboardView.tsx` con el endpoint real del backend `POST /api/v1/finanzas/clasificar`, reemplazando (o complementando) la función local `autoCategorizeDescription`. Esto permitirá que la IA del backend determine la categoría y el nivel de riesgo de cada gasto ingresado de forma individual, alineando el comportamiento local con las capacidades de la API, sin alterar el diseño visual existente.

## User Review Required

**⚠️ ADVERTENCIA: Cambio de idioma y nombres de variables en el componente**
Siguiendo las Convenciones de Nomenclatura, el estado interno de `DashboardView.tsx` todavía utiliza inglés (`quickDesc`, `quickAmount`, `quickCategory`, `isModelFailed`, etc.). Propongo renombrar estas variables al español (`descripcionRapida`, `valorRapido`, `categoriaRapida`, `modeloFallo`, etc.) para cumplir la regla global y alinear explícitamente `valorRapido` con el campo `valor` esperado por el backend. ¿Apruebas este renombramiento para todo el estado interno del componente?

## What Changes

- Implementación de la llamada a `POST /api/v1/finanzas/clasificar` para obtener la categoría cuando el usuario envía una transacción rápida.
- Mantenimiento del categorizador local como *fallback* o "preview" en tiempo real mientras el usuario escribe la descripción (ya que el endpoint exige un `valor` que el usuario podría no haber ingresado aún).
- **Sugerencias Futuras:** Actualmente la API exige el parámetro `valor` (amount) para clasificar una transacción. Dado que el diseño del frontend prevé una pre-clasificación en vivo solo con la `descripcion`, se sugiere para una versión futura del backend hacer que `valor` sea opcional en el endpoint `/clasificar` para poder consumir la API en cada pulsación del teclado sin falsear el monto.
- Renombramiento de estados locales de `DashboardView` al español (sujeto a aprobación).
- Conservación íntegra del diseño, clases de Tailwind, animaciones y comportamiento visual (se mantendrán las alertas, insignias y estados "fallidos" del modelo).

## Capabilities

### New Capabilities
- `dashboard-quick-add-classification`: Conexión de la función de agregado rápido de transacciones con la API de clasificación inteligente, interpretando la respuesta del modelo Python a través del backend.

### Modified Capabilities

## Impact

- `src/components/DashboardView.tsx`: Refactorización de manejadores (`handleQuickAdd`) y estados internos.
- No hay cambios en el backend (se respetan las restricciones arquitectónicas).
