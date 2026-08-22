## Context

Tras explorar la aplicación, se detectaron discrepancias en cómo se presentan dos métricas importantes: el nivel de endeudamiento y la salud promedio histórica. 
El **Nivel de Endeudamiento** no coincide con las variables guardadas (se consulta `nivelEndeudamiento` en vez de `ratioDeuda`), mostrándose siempre en 0% estático.
El **Historial de Análisis** calcula el promedio matemático de la probabilidad estadística del modelo en vez del estado asginado. Además, el backend retorna estados como `"Estable"` que el frontend no clasifica en los filtros de la vista, causando que esos registros queden ocultos al usar los botones de filtrado.

## Goals / Non-Goals

**Goals:**
- Conectar visualmente la barra de deuda con el `ratioDeuda` calculado en tiempo real.
- Asignar estilos dinámicos tipo semáforo a la barra de deuda en `SettingsProfileView` y `ReportsView`.
- Incluir los 6 estados del modelo en las interfaces TS y filtros de UI.
- Cambiar la fórmula estadística de la Salud Promedio Histórica asignando pesos matemáticos a los estados nominales para reflejar la tendencia real.

**Non-Goals:**
- No se modificarán los endpoints del backend; todo el mapeo y recálculo se manejará estrictamente en el estado de React y utilitarios (`mapeadores.ts`).

## Decisions

- **Cálculo de Nivel de Endeudamiento en Settings:**
  - Fórmula: `ingresoMensual > 0 ? Math.round((deudaTotal / ingresoMensual) * 100) : 0`
  - Función Helper para el Color (`getDebtColor(ratio)`):
    - `ratio <= 30`: `#10b981` (Verde/Saludable)
    - `ratio <= 50`: `#fd933d` (Naranja/Precaución)
    - `ratio > 50`: `#ba1a1a` (Rojo/Riesgo)

- **Unificación de Estados del Backend (`mapeadores.ts` & `HistoryView.tsx`):**
  - La interfaz `HealthStatus` en `types.ts` pasará a ser: `'Crítico' | 'En riesgo' | 'En observación' | 'Estable' | 'Saludable' | 'Excelente'`.
  - En la UI, `'Riesgo'` se transformará o se unificará visualmente a `'En riesgo'` (o viceversa según el mapeo final del componente de historiales) y `"Observación"` a `"En observación"`.

- **Cálculo de Salud Promedio:**
  - Asignaremos pesos a cada estado: `Excelente` = 100, `Saludable` = 80, `Estable` = 60, `En observación` = 40, `En riesgo` = 20, `Crítico` = 0.
  - El promedio sumará estos pesos (`totalPesos / length`) en lugar de sumar la probabilidad arrojada por la IA (`puntajeSalud`).
  - La UI mostrará el resultado como `{estadisticas.avgScore}% promedio`.

## Risks / Trade-offs

- **Riesgo:** Si el backend envía nuevos estados imprevistos, los filtros podrían volver a romperse.
- **Mitigación:** Proveer un `default` robusto en el mapeo, transformando estados desconocidos en `'En observación'` o similar, de forma que siempre caigan en una de las 4 categorías manejadas por el frontend.
