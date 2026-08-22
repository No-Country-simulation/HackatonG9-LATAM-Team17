## 1. Corrección en `DashboardView.tsx`

- [x] 1.1 En `src/components/DashboardView.tsx`, localizar el `useMemo` de `distribucionMensual`.
- [x] 1.2 Eliminar la lógica de acumulación con `reportesDelMes.forEach` (líneas ~105-116).
- [x] 1.3 Cambiar el retorno para que si `reportesDelMes.length > 0`, devuelva directamente `reportesDelMes[0].distribucionCategorias` (ordenada de mayor a menor monto).
- [x] 1.4 Asegurar que se mantenga el caso fallback: si `reportesDelMes.length === 0 && report`, retornar `report.distribucionCategorias`.
- [x] 1.5 Si ambos están vacíos, retornar `[]`.

## 2. Corrección en `ReportsView.tsx`

- [x] 2.1 En `src/components/ReportsView.tsx`, localizar el inicio del componente donde se procesa `historicalReports`.
- [x] 2.2 Reemplazar la acumulación de `totalCategoriesMap` y `totalGastadoGeneral` con la selección directa del primer elemento: `const snapshot = historicalReports[0]`.
- [x] 2.3 Asignar `totalGastadoGeneral = snapshot?.totalGastado || 0`.
- [x] 2.4 Asignar `distribucionCategoriasTotal` directamente desde `snapshot?.distribucionCategorias || []` y ordenarla descendentemente por `monto`.
- [x] 2.5 Asegurarse de que el uso de `totalGastadoGeneral` en la tarjeta principal (Total Gastado) concuerde con el uso en "Ahorro del Último Análisis" (línea 272, que ya usaba `historicalReports[0]?.totalGastado`).
- [x] 2.6 Eliminar cualquier bucle `forEach` residual de la antigua sumatoria global de categorías.
