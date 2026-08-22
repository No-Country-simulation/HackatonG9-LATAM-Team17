## Why

Al corregir el flujo de datos del historial, se destapó un problema matemático crítico en los componentes `ReportsView` y `DashboardView`: "El efecto multiplicador". Dado que el backend almacena cada análisis como una fotografía o "snapshot" completa del estado financiero del usuario en el momento de generarlo, iterar sobre el historial y *sumar* sus distribuciones de gastos y totales provoca que los mismos gastos se cuenten múltiples veces. Si un usuario genera tres análisis en un mes, sus gastos mostrados se triplicarán, rompiendo la veracidad de los reportes.

## What Changes

- **DashboardView**: En lugar de sumar todos los `totalGastado` y `distribucionCategorias` de todos los análisis generados en el mes (`reportesDelMes`), se utilizará únicamente el snapshot más reciente del mes, ya que este contiene la versión más actualizada y consolidada de los datos para ese período.
- **ReportsView**: Se corregirá el cálculo de la variable `distribucionCategoriasTotal` y de `totalGastadoGeneral` para que no sume los datos de *todo* el historial existente, sino que lea el snapshot más reciente (el índice `[0]`) del historial correspondiente.
- **Consistencia Visual**: Esto alineará la tarjeta secundaria "Ahorro del Último Análisis" de `ReportsView` (que ya leía de `historicalReports[0]`) con las gráficas principales, que estaban leyendo agregaciones.

## Capabilities

### New Capabilities
- `snapshot-aggregation-fix`: Define la forma correcta de extraer métricas globales a partir de un arreglo de análisis (tomando el último snapshot en vez de sumar todos) para evitar doble contabilización en Dashboard y Reportes.

### Modified Capabilities
- (ninguna a nivel de requerimientos de la API, solo corrección en capa de presentación)

## Impact

- **`src/components/DashboardView.tsx`**: Afectará al bloque del `useMemo` que calcula `distribucionMensual`.
- **`src/components/ReportsView.tsx`**: Afectará al bucle inicial donde se calculaban `totalGastadoGeneral` y el mapa `totalCategoriesMap`.
- **Experiencia de Usuario**: Los gráficos volverán a mostrar valores realistas y correctos en lugar de números absurdamente inflados cada vez que un usuario haga clic en "Analizar Finanzas".
