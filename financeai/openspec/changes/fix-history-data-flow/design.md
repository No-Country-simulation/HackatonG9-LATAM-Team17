## Context

La API backend `/api/v1/finanzas/historial` fue actualizada para devolver una respuesta paginada (`Page<AnalisisFinanciero>`) en lugar de una lista plana. El frontend nunca fue actualizado para manejar esto: `App.tsx` sigue leyendo `data` como si fuera un array, lo cual siempre evalúa como falso y deja `analysisHistory` vacío en memoria. Como consecuencia, la sección "Recomendaciones del Experto" del Dashboard nunca muestra recomendaciones históricas cruzadas, y el resto de vistas que dependen de `analysisHistory` (ReportsView, DashboardView distribucionMensual) operan con datos vacíos.

`HistoryView.tsx` es la única vista que funciona porque realiza su propio fetch independiente y aplica un mapeo parcial local. Sin embargo, este fetch es redundante, duplica lógica de normalización y no puede beneficiarse de datos frescos añadidos durante la sesión (p.ej. análisis recién generados).

Adicionalmente, las recomendaciones del historial llegan como `string[]` y los componentes esperan objetos `Recomendacion`. Sin la conversión, `rec.titulo` es `undefined` y las tarjetas no se pintan.

## Goals / Non-Goals

**Goals:**
- Corregir el parseo de la respuesta paginada en `App.tsx` (leer `data.content`).
- Centralizar todo el mapeo del historial en `App.tsx` usando las funciones de `mapeadores.ts`.
- Convertir `HistoryView.tsx` en un componente puramente presentacional (sin fetch propio).
- Corregir el botón "Ver detalles" de cada recomendación en el Dashboard para que abra el análisis de origen correcto.

**Non-Goals:**
- Implementar paginación completa en la UI (cargar más páginas).
- Modificar endpoints del backend.
- Cambiar el diseño visual de ninguno de los componentes afectados.
- Sincronización en tiempo real del historial.

## Decisions

### D1 — Extraer `mapearItemHistorial` como función en `mapeadores.ts`

**Decisión**: Crear una función exportable `mapearItemHistorial(item: any): ReporteAnalisis` que encapsule la transformación completa de un ítem crudo del backend a `ReporteAnalisis` (normalización de perfil, conversión de `string[]` a `Recomendacion[]`, cálculo de `totalGastado` desde transacciones).

**Alternativa descartada**: Duplicar la lógica inline en `App.tsx`. Descartada porque `HistoryView` ya tenía una copia parcial, crear otra en `App.tsx` profundizaría el problema de mantenibilidad.

**Por qué `mapeadores.ts`**: Ya existe `mapearAnalisisOutputDTO` en ese módulo para el flujo de análisis nuevo. Es el lugar natural para todas las transformaciones de datos del backend.

---

### D2 — `HistoryView` consume el prop, no hace fetch

**Decisión**: Eliminar el `useEffect` de `fetch('/api/v1/finanzas/historial')` de `HistoryView.tsx`. El componente renderiza `analysisHistory` que recibe como prop desde `App.tsx`.

**Alternativa descartada**: Mantener el fetch de `HistoryView` y también arreglarlo. Descartada porque tendríamos dos lugares a mantener sincrónicamente ante cambios de API.

**Riesgo gestionado**: Sin el fetch propio, `HistoryView` mostrará un estado vacío si `App.tsx` no cargó el historial. Se mantendrá el estado `cargandoHistorial` como prop o derivado para mostrar el skeleton loader correctamente.

---

### D3 — `RecomendacionExtendida` guarda referencia al reporte de origen

**Decisión**: Extender la interfaz local `RecomendacionExtendida` en `DashboardView.tsx` añadiendo `reporteOrigen: ReporteAnalisis`. El botón "Ver detalles" llamará `onOpenAnalysisModal(rec.reporteOrigen)`.

```typescript
interface RecomendacionExtendida extends Recomendacion {
  fechaAsociada?: string;
  reporteOrigen: ReporteAnalisis;  // NUEVO
}
```

**Por qué**: Es el dato mínimo necesario para navegar al reporte correcto sin cambiar props ni contextos globales.

---

### D4 — Mensaje motivador del historial derivado del perfil

**Decisión**: Al mapear el historial, el `mensajeMotivador` se derivará del `perfilFinanciero` usando el mismo diccionario ya existente en `mapearAnalisisOutputDTO`, en lugar del texto genérico actual "Sigue esforzándote".

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| La API devuelve vacío o estructura diferente en producción | Mantener fallback: `data?.content ?? []` con log de advertencia |
| Eliminar el fetch de `HistoryView` deja la pestaña vacía si `App.tsx` no cargó | `App.tsx` ya es quien lo carga al inicio; se mantiene spinner basado en `cargandoAuth` |
| Análisis muy antiguos sin `recomendaciones` en BD | `item.recomendaciones || []` ya existe como fallback; se mapea a array vacío |
| El `useEffect` de recomendaciones del Dashboard se ejecuta aleatoriamente en cada render | Ya existía este comportamiento; no se agrava. Mejora futura: seed determinístico por usuario |

## Sugerencias Futuras (Backend)

- Implementar autenticación real por usuario en `/analizar` y `/historial` para evitar contaminación de datos entre usuarios registrados.
- Añadir endpoint para obtener las recomendaciones de todos los análisis de forma paginada, para soportar un sistema de "plan de acción" histórico sin cargar todos los análisis completos.
