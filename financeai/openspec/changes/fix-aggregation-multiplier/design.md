## Context

Con la implementación de `fix-history-data-flow`, el arreglo `analysisHistory` ahora se pobla correctamente en la inicialización de la app (`App.tsx`). Sin embargo, se descubrió que los componentes que muestran datos financieros agrupados (`ReportsView` y `DashboardView`) estaban implementando una lógica defectuosa: usaban `forEach` para sumar la distribución de categorías (`distribucionCategorias`) y el total gastado (`totalGastado`) a través de múltiples reportes en el mismo periodo de tiempo.

Dado que cada "análisis" del backend es una fotografía completa ("snapshot") del estado financiero del usuario en el momento de su ejecución (incluyendo todas las transacciones hasta ese punto), sumar los totales de dos reportes del mismo mes duplica artificialmente el volumen de gasto. Este "efecto multiplicador" invalida totalmente las métricas presentadas al usuario si este realiza más de un análisis.

## Goals / Non-Goals

**Goals:**
- En `DashboardView.tsx`: Mostrar la distribución de categorías del snapshot más reciente del mes actual, eliminando la sumatoria de múltiples reportes.
- En `ReportsView.tsx`: Mostrar la distribución de categorías y el total gastado del snapshot más reciente en el periodo seleccionado (o en general), en vez de iterar y sumar sobre todo el historial.
- Asegurar que la lógica sea robusta en caso de que no existan reportes en el periodo o historial.

**Non-Goals:**
- Cambiar la forma en que el backend guarda los análisis (seguir asumiendo que son snapshots).
- Cambiar la UI (el diseño de la tarjeta de progreso en `ReportsView` o la Dona en `DashboardView` se mantienen exactamente igual).

## Decisions

### D1 — Extraer el Snapshot Más Reciente

**Decisión**: En ambos componentes, se extraerá el elemento índice `0` (el más reciente, dado que `analysisHistory` se asume ordenado de forma descendente) del array filtrado, y se usará ese objeto directamente en lugar de instanciar un acumulador y hacer `forEach`.

**En `DashboardView` (Distribución Mensual):**
```typescript
const reportesDelMes = analysisHistory.filter(...);
if (reportesDelMes.length > 0) {
  return reportesDelMes[0].distribucionCategorias;
}
return report?.distribucionCategorias || [];
```
*Alternativa considerada*: Sumar las `transactions` crudas (ignorar la data analizada). *Por qué se descartó*: Desperdicia el trabajo del backend, es más complejo en el frontend, y el backend ya entrega las categorías coloreadas y con porcentajes precalculados para el reporte de análisis.

**En `ReportsView` (Distribución General):**
```typescript
const snapshotReciente = historicalReports[0];
const totalGastadoGeneral = snapshotReciente?.totalGastado || 0;
const distribucionCategoriasTotal = snapshotReciente?.distribucionCategorias || [];
```
*Alternativa considerada*: Calcular un total basado en el periodo de fechas específico. *Por qué se descartó*: Actualmente el filtro `periodoSeleccionado` no es funcional y todo asume un reporte global. Tomaremos el último reporte de la vida del usuario, que coincide con el reporte más actual de su vida financiera (su último análisis global).

### D2 — Armonización de `ReportsView`

**Decisión**: Alinear el valor mostrado en la métrica "Ahorro del Último Análisis" con los gráficos de barras de progreso inferior.
Anteriormente "Ahorro del Último Análisis" calculaba `$Ingreso - historicalReports[0].totalGastado` (ya estaba correcto), mientras que la gráfica de barras calculaba sus porcentajes usando el sumatorio hiper-inflado de `totalGastadoGeneral`. Con D1, ambos dependerán del último snapshot.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| **Datos Incompletos**: Si un usuario tiene transacciones nuevas pero no ha hecho click en "Analizar Finanzas", el Dashboard mostrará datos viejos. | Esto es un comportamiento por diseño del modelo actual ("Dashboard muestra el último análisis, no tiempo real crudo"). |
| **Pérdida de Orden**: Si el backend deja de enviar el historial ordenado de más nuevo a más viejo, el índice `[0]` podría ser un reporte antiguo. | Confiaremos en la persistencia del orden (por fecha descendente) del endpoint `/historial`. Como resguardo, se podría agregar un `.sort()` en `App.tsx` a futuro si se vuelve inestable. |
