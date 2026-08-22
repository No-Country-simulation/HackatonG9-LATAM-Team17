## 1. Función de Mapeo Centralizado (`mapeadores.ts`)

- [x] 1.1 En `src/utils/mapeadores.ts`, crear y exportar la función `mapearItemHistorial(item: any): ReporteAnalisis` que transforme un ítem crudo del backend (con `perfilFinanciero`, `fechaAnalisis`, `transacciones`, `categorias`, `recomendaciones`, `probabilidad`) al tipo `ReporteAnalisis`.
- [x] 1.2 Dentro de `mapearItemHistorial`, calcular `totalGastado` sumando `tx.valor` de cada elemento en `item.transacciones || []`.
- [x] 1.3 Dentro de `mapearItemHistorial`, aplicar `normalizarPerfil(item.perfilFinanciero)` para garantizar el valor canónico.
- [x] 1.4 Dentro de `mapearItemHistorial`, convertir `item.recomendaciones` (que es `string[]`) a `Recomendacion[]` usando las funciones `inferirImpacto` e `inferirTipoEstado` ya existentes en el módulo.
- [x] 1.5 Dentro de `mapearItemHistorial`, derivar `mensajeMotivador` del perfil normalizado usando el mismo diccionario de `mapearAnalisisOutputDTO`.
- [x] 1.6 Dentro de `mapearItemHistorial`, mapear `item.categorias || []` a `distribucionCategorias` (ya vienen con los campos necesarios desde el backend, solo verificar la estructura y aplicar `getColorForCategory` si falta `colorHex`).

## 2. Corrección del Fetch en `App.tsx`

- [x] 2.1 En el `useEffect` de carga inicial de `App.tsx`, cambiar `if (data && Array.isArray(data))` por `if (data?.content && Array.isArray(data.content) && data.content.length > 0)`.
- [x] 2.2 Aplicar `.map(mapearItemHistorial)` al array `data.content` antes de llamar a `setAnalysisHistory` y `setCurrentReport`.
- [x] 2.3 Verificar que el `import` de `mapearItemHistorial` desde `../utils/mapeadores` quede añadido en los imports de `App.tsx`.

## 3. Eliminación del Fetch Redundante en `HistoryView.tsx`

- [x] 3.1 Eliminar completamente el `useEffect` que hace `fetch('/api/v1/finanzas/historial')` en `HistoryView.tsx` (líneas ~44-80).
- [x] 3.2 Eliminar el estado local `cargandoHistorial` y su `useState`.
- [x] 3.3 Cambiar el estado `historialLocal` para que se inicialice con `analysisHistory` (el prop) y actualice cuando cambie el prop usando `useEffect(() => setHistorialLocal(analysisHistory), [analysisHistory])`.
- [x] 3.4 Eliminar el import de `normalizarPerfil` de `HistoryView.tsx` si ya no se usa en ese componente (ahora se usa solo en `mapeadores.ts`).
- [x] 3.5 Verificar que el spinner de carga y el estado vacío de `HistoryView` sigan funcionando correctamente (si `analysisHistory` llega vacío, mostrar el estado vacío; si llega con datos, mostrar la lista).

## 4. Corrección del Botón "Ver Detalles" en `DashboardView.tsx`

- [x] 4.1 Extender la interfaz local `RecomendacionExtendida` en `DashboardView.tsx` añadiendo el campo `reporteOrigen: ReporteAnalisis`.
- [x] 4.2 En el `useEffect` que genera `recoMixtas`, añadir `reporteOrigen: rep` al objeto que se hace push, para cada recomendación mixta construida.
- [x] 4.3 En el handler del botón "Ver detalles" (línea ~540), cambiar `onOpenAnalysisModal(report)` por `onOpenAnalysisModal(rec.reporteOrigen)`.
- [x] 4.4 Verificar que el caso de fallback (cuando `analysisHistory.length === 0` y se usa `report?.recomendaciones`) también asigne `reporteOrigen: report` a cada recomendación.
