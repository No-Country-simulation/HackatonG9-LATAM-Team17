## Why

Actualmente, el sistema confunde el porcentaje de "confianza de predicción" del modelo de Inteligencia Artificial con un "puntaje de salud financiera". A su vez, el estado financiero devuelto por el modelo se almacena bajo el nombre `estadoSalud`. Esta nomenclatura ("Salud Financiera") genera interferencia cognitiva y hace creer al usuario que el nivel de confianza de la IA es su calificación financiera personal. Para erradicar esta interferencia, debemos adoptar los términos reales que provee el backend y eliminar por completo el concepto de "Salud" de la interfaz y del código.

## What Changes

- Renombrar la propiedad `puntajeSalud` a `confianzaModelo` en todas las interfaces que tienen esta propiedad (incluyendo el flujo de datos y `src/types.ts`).
- Renombrar la propiedad `estadoSalud` a `perfilFinanciero` en todo el código fuente y estados globales para erradicar el concepto de "Salud".
- Actualizar el mapeo de la respuesta del backend (`data.probabilidad` -> `confianzaModelo` y `data.perfil_financiero` -> `perfilFinanciero`).
- Corregir las etiquetas visuales en `AnalysisDetailModal.tsx`, `HistoryView.tsx` y `AnalysisTimelineModal.tsx` para separar claramente "Perfil Financiero" de "Confianza de IA".
- Modificar la lógica de la mascota en el modal para que su expresión dependa de `perfilFinanciero` y no del porcentaje de confianza.
- **BREAKING**: El esquema del tipo `ReporteAnalisis` cambiará, lo que afectará cómo se guardan y leen los reportes en el estado global.

## Capabilities

### New Capabilities
- `ai-confidence-display`: Presentación transparente y precisa de los metadatos y niveles de confianza de las predicciones del modelo de IA.

### Modified Capabilities
- `analysis-reporting`: Se erradica el concepto de "Salud Financiera", reemplazándolo por "Perfil Financiero" (estado) y "Confianza de IA" (porcentaje estadístico).

## Impact

- **Código Afectado**: `src/types.ts`, `src/App.tsx` y componentes UI (`NewAnalysisView.tsx`, `HistoryView.tsx`, `DashboardView.tsx`, `AnalysisDetailModal.tsx`, `AnalysisTimelineModal.tsx`).
- **Estado Global**: Historiales guardados localmente necesitarán una capa de compatibilidad para hacer fallback de las nuevas variables (`confianzaModelo` / `perfilFinanciero`) hacia las antiguas (`puntajeSalud` / `estadoSalud`).
- **Backend**: Ninguno. El backend ya utiliza `perfil_financiero` y `probabilidad`.
