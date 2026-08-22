## Why

Actualmente el `DashboardView` contiene varios elementos estáticos (como la fecha de "15 de Octubre, 2024", el banner de "Error de conexión" hardcodeado y las recomendaciones de un solo análisis) que no reflejan el estado real ni la evolución financiera del usuario. Esta propuesta busca transformar el Dashboard en una interfaz completamente dinámica, basada en el historial del usuario y el estado real de la aplicación, incrementando el valor de la inteligencia artificial al mostrar resúmenes agregados del mes en lugar de solo datos aislados, mejorando así la percepción de calidad ("premium") de la aplicación.

## What Changes

- Reemplazar la fecha estática del saludo por la fecha actual del sistema formateada en español.
- **BREAKING**: El componente `DashboardView` ahora requerirá recibir el `analysisHistory` (historial completo de análisis) además del reporte actual.
- Ocultar el banner de "Error de conexión / Sincronización exitosa" por defecto. Mostrar error solo si falla un endpoint real de historial, y mostrar éxito temporalmente luego de un nuevo análisis.
- Modificar el cálculo de la "Distribución de Gastos" en el Dashboard para que sume los datos de TODOS los análisis pertenecientes al mes en curso, recalculando porcentajes sobre el total agregado mensual.
- Modificar la terminología de "Probabilidad de mejora financiera" por "Confianza de la IA" o "Certeza del modelo" basándose en la nomenclatura real devuelta por el backend.
- Cambiar la visualización de "Recomendaciones del experto": tomar aleatoriamente 1 recomendación de cada análisis histórico disponible y mostrar a qué fecha pertenece.
- **NUEVA UI**: Al hacer clic en "Ver reporte completo", abrir un nuevo Modal de Historial (Timeline) que liste cronológicamente todos los reportes históricos. Desde allí se podrá ingresar al detalle específico de cada uno.
- **Sugerencia Futura (Backend)**: Los análisis agregados por mes se están realizando localmente en el frontend iterando el historial, dado que el backend no provee actualmente un endpoint de totales mensuales directos. 

## Capabilities

### New Capabilities
- `dashboard-ui-dynamics`: Capacidad encargada de transformar los componentes del dashboard (fecha, banner, textos de probabilidad y distribución mensual) basándose en el estado global de la aplicación.
- `dashboard-historical-insights`: Capacidad encargada de extraer datos del historial de análisis para alimentar recomendaciones agregadas (una por análisis aleatoria) y la nueva vista de historial (Timeline Modal).

### Modified Capabilities

## Impact

- `src/components/DashboardView.tsx`: Cambios significativos en renderizado (fecha, banner, distribución, recomendaciones, cambio de terminología).
- `src/App.tsx`: Necesita pasar `analysisHistory` y posiblemente un estado global de error de conexión hacia `DashboardView`.
- **Nuevos Componentes**: Se requerirá crear un `AnalysisTimelineModal.tsx` o similar para listar el historial cronológico antes de abrir el `AnalysisDetailModal.tsx`.
