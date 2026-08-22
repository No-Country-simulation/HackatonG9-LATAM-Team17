## Context

El componente `DashboardView` se creó inicialmente como un visor estático del último reporte financiero del usuario. Sin embargo, para aportar un valor analítico real, debe transformarse en una vista consolidada que refleje el historial completo del mes y el estado real de la aplicación (como los errores de sincronización). Dado que el backend no provee un endpoint agregado de análisis mensual, toda esta consolidación debe realizarse mediante transformaciones locales en el frontend utilizando el historial en caché.

## Goals / Non-Goals

**Goals:**
- Actualizar el `DashboardView` para que consuma `analysisHistory` (pasado desde `App.tsx`).
- Calcular dinámicamente la "Distribución de Gastos" del mes agregando todas las categorías del historial.
- Refactorizar las "Recomendaciones del experto" para que muestren 1 por cada análisis en el historial, de forma aleatoria, con su fecha correspondiente.
- Implementar un nuevo componente de interfaz `AnalysisTimelineModal` para listar el historial y permitir navegar a un detalle específico.
- Corregir textos hardcodeados (fecha actual) y términos equívocos ("Probabilidad de mejora financiera" a "Confianza de la IA").

**Non-Goals:**
- Crear nuevos endpoints en el backend para sacar consolidados mensuales. Todo se hace local.
- Cambiar la estructura de `ReporteAnalisis` profundamente, solo agregar soporte para consumir un array del mismo.

## Decisions

**1. Consolidación Mensual en el Frontend:**
- **Razón:** El backend no tiene endpoints para dar resúmenes mensuales de análisis, solo devuelve reportes individuales.
- **Implementación:** Al renderizar la sección de Distribución de Gastos, filtraremos los `ReporteAnalisis` que pertenezcan al mes actual (comparando `fecha` o `marcaTiempo`). Luego, sumaremos `totalGastado` y cada `monto` de sus distribuciones de categorías. Recalcularemos el `porcentaje` final sobre esa nueva suma.

**2. Componente AnalysisTimelineModal:**
- **Razón:** Proveer acceso al historial cronológico antes de abrir el detalle.
- **Implementación:** Se agregará al estado global o a `App.tsx` un modal intermedio. Cuando el usuario hace clic en "Ver reporte completo" en el Dashboard, se abre `AnalysisTimelineModal`. Este listará el historial. Al hacer clic en un elemento de esa lista, llamará a `onOpenAnalysisModal(reporteSeleccionado)` para ver el detalle como ocurre ahora.

**3. Recomendaciones Aleatorias con Metadata:**
- **Razón:** Mostrar que la IA es iterativa e histórica.
- **Implementación:** Mapear `analysisHistory` usando `.map()`, extraer `recomendaciones` de cada uno. Escoger un elemento aleatorio (usando `Math.floor(Math.random() * length)`). Para mostrar la fecha, renderizaremos un texto tipo: `Del análisis: [Fecha]`.

## Risks / Trade-offs

- **Riesgo:** Si el usuario tiene cientos de análisis en un mismo mes, la iteración y suma de arreglos podría ser costosa en cada render (re-cálculo O(n)).
  - *Mitigación:* Se utilizará `useMemo` en el frontend para memoizar la suma mensual dependiente de `analysisHistory`, evitando cálculos innecesarios en re-renders.
- **Riesgo:** Generación aleatoria en la fase de render causando re-renders infinitos.
  - *Mitigación:* La selección aleatoria de recomendaciones se hará una sola vez al cambiar el historial y se guardará en un estado local (ej. `useState` + `useEffect`), no directamente durante el retorno JSX.
