## Why

En `src/types.ts`, el tipo `ReporteAnalisis` exige la propiedad `logroSemanal` como obligatoria. Sin embargo, el backend no retorna esta información en sus endpoints de análisis o historial. Mantener este campo obligatorio en el frontend causa errores de tipado, especialmente cuando queremos inyectar o manejar datos que no lo tienen (como transacciones mapeadas a reportes, u otros estados temporales), rompiendo la UI u obligándonos a mockear datos innecesariamente. Dado que no hay soporte del backend, lo más sensato es eliminar por completo la sección de "Logro Semanal".

## What Changes

- **BREAKING**: Eliminar la propiedad `logroSemanal` de la interfaz `ReporteAnalisis` en `src/types.ts`.
- Remover cualquier mención o renderizado de `logroSemanal` en los componentes que lo consuman, como `HistoryView.tsx` o `ReportsView.tsx` (en caso de que exista).
- Asegurarse de que el frontend no espere ni genere datos falsos sobre "racha ahorrativa" o similares, limpiando el código de lógica obsoleta.

## Capabilities

### New Capabilities
*(Ninguna)*

### Modified Capabilities
- `tipos-analisis`: Modificación de los requisitos de tipos frontend para igualarlos a la respuesta estricta del backend (eliminación de campos no soportados).

## Impact

- `src/types.ts`: Cambio de interfaz de `ReporteAnalisis`.
- `src/components/HistoryView.tsx`: Eliminación del mock de `logroSemanal` y de cualquier renderizado (si aplica).
- `src/components/ReportsView.tsx` o `DashboardView.tsx`: Revisión y limpieza si se usaba `report.logroSemanal`.
