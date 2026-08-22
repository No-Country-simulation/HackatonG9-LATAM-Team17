## Why

Actualmente, las métricas financieras clave en los perfiles y reportes presentan inconsistencias que confunden al usuario:
1. El **Nivel de Endeudamiento** en el perfil de configuración está atado a una variable inexistente (`nivelEndeudamiento`), mostrándose siempre en 0%. Además, tanto allí como en la vista de reportes, su barra de progreso carece de dinamismo (siempre es color naranja estático).
2. En el **Historial de Análisis**, la métrica "Salud Promedio" está promediando la probabilidad del modelo en lugar de promediar el estado de salud asignado, lo que no refleja el promedio real de salud. Además, los botones de filtros de estados no reflejan los 6 estados reales devueltos por la IA (Crítico, En riesgo, En observación, Estable, Saludable, Excelente), lo que rompe los filtros y la cuenta de reportes.

## What Changes

- **Corrección de Variable de Endeudamiento:** Se cambiará la referencia de `nivelEndeudamiento` a `ratioDeuda` (existente en `types.ts`) en `SettingsProfileView.tsx`, calculándola localmente a partir de los ingresos y las deudas.
- **Barras Dinámicas de Endeudamiento:** Se implementará una escala de colores semaforizada (Verde < 30%, Naranja 30-50%, Rojo > 50%) para la barra de endeudamiento en `SettingsProfileView.tsx` y `ReportsView.tsx`.
- **Integración de los 6 Estados al Historial:** Se actualizará `HealthStatus` en `types.ts` para abarcar de forma exacta los 6 estados arrojados por el modelo: `'Crítico'`, `'En riesgo'`, `'En observación'`, `'Estable'`, `'Saludable'`, `'Excelente'`. Se agregarán botones de filtro para cada uno de ellos en `HistoryView.tsx`.
- **Normalización de Estados:** En `mapeadores.ts`, se mapearán variaciones menores (ej. `"Observación"`) hacia su equivalente estricto (`"En observación"`).
- **Cálculo de Salud Promedio basado en Asignación:** Se cambiará la fórmula de "Salud Promedio" para promediar pesos asignados a cada uno de los 6 estados (Excelente=100, Saludable=80, Estable=60, En observación=40, En riesgo=20, Crítico=0) en vez de promediar la probabilidad estadística.

## Capabilities

### New Capabilities
- `metricas-endeudamiento`: Corrección del flujo y visualización semaforizada dinámica del Nivel de Endeudamiento en Perfil y Reportes.
- `metricas-historial`: Normalización de los estados del backend para filtros precisos y recálculo estadístico de la salud promedio.

### Modified Capabilities

## Impact

- `types.ts`: Se refactorizará `HealthStatus` para usar los 6 estados de la IA.
- `HistoryView.tsx`: Nuevos filtros y lógica de cálculo.
- `SettingsProfileView.tsx`: Corrección de variables (`ratioDeuda` vs `nivelEndeudamiento`) y estilos dinámicos.
- `ReportsView.tsx`: Estilos dinámicos para la barra de endeudamiento.
- `mapeadores.ts`: Normalización de respuesta del backend para el historial.
