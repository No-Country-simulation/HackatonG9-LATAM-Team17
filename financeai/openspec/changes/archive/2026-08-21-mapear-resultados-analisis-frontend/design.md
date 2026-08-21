## Context

El frontend de la aplicación en la vista `NewAnalysisView.tsx` actualmente espera una estructura en la respuesta del backend bajo el esquema `datos_analisis`. Sin embargo, el backend en `/api/v1/finanzas/analizar` retorna los campos planos en la raíz de la respuesta (`perfil_financiero`, `probabilidad`, `resumen_gastos`, `recomendaciones`), lo que provoca que el frontend no pueda construir el reporte de análisis y no se muestre nada en la interfaz tras procesar.

## Goals / Non-Goals

**Goals:**
- Mapear la respuesta real del backend a la estructura `ReporteAnalisis` definida en `src/types.ts` del frontend.
- Asegurar que la vista modal o reporte pueda mostrar todos los indicadores a partir de los datos mapeados (Estado de salud, puntaje, totales, categorías de gasto y recomendaciones formatadas).

**Non-Goals:**
- No se modificarán endpoints ni estructuras en el backend, por restricciones arquitectónicas. 
- No se creará la lógica para persistir el reporte en localstorage/backend más allá del actual que ya existe o se asume funcional.

## Decisions

- **Mapeo inline en el manejador del fetch**: En `NewAnalysisView.tsx`, cuando se recibe `res.json()`, se adaptará la lógica para crear el objeto `ReporteAnalisis`.
  - `totalGastado`: Se derivará iterando y sumando los valores del objeto map `resumen_gastos`.
  - `puntajeSalud`: Se derivará multiplicando el double `probabilidad` por 100.
  - `estadoSalud`: Se derivará de `perfil_financiero` (ej. "Estable" se considera un `HealthStatus` válido o se forza a uno compatible).
  - `mensajeMotivador`: Se añadirá un string genérico predeterminado en el frontend.
  - `distribucionCategorias`: Se reconstruirá mapeando `resumen_gastos` con colores por defecto.
  - `recomendaciones`: Se iterará sobre el array de strings devueltos por el backend, empaquetándolos en el tipo `Recomendacion` del frontend con placeholders visuales seguros.

## Risks / Trade-offs

- **Risk**: Valores inesperados del backend que puedan romper las funciones (ej. strings nulos en `recomendaciones`).
  - **Mitigation**: Agregar validaciones u opciones por defecto (fallbacks, arrays vacíos predeterminados) durante el proceso de mapeo para que la interfaz nunca se rompa.
