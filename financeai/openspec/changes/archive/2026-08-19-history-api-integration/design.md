## Context
El componente `HistoryView.tsx` visualiza el historial de análisis. Actualmente recibe `analysisHistory` como prop. Para integrarlo de forma independiente a la API, usaremos `GET /api/v1/finanzas/historial`. Esto requiere que la vista maneje su propio estado y ciclo de vida de los datos. Adicionalmente, el estado interno del componente todavía usa variables en inglés, lo que contraviene la convención principal de usar español en toda la base de código.

## Goals / Non-Goals

**Goals:**
- Añadir la capacidad de cargar datos desde la API `GET /api/v1/finanzas/historial` directamente en `HistoryView.tsx`.
- Renombrar todos los estados locales de filtros/búsqueda al español (ej. `searchQuery` -> `busqueda`).
- Reutilizar `mapeadores.ts` o crear la lógica para transformar la respuesta de historial a `ReporteAnalisis`.

**Non-Goals:**
- No se modificará el endpoint ni el backend. Las limitantes del historial (ej. puntaje faltante) serán manejadas mediante defaults locales.
- No se cambiarán propiedades de componentes superiores (`App.tsx`), `HistoryView` funcionará de forma independiente o usando props iniciales si la API falla.

## Decisions

**1. Estado Local vs Props**
- *Decisión*: `HistoryView` recibirá un estado inicial por `props`, pero hará un *fetch* al montarse para actualizar una variable local `historialLocal`. Si el *fetch* falla, usa la prop.
- *Racional*: Esto permite una carga rápida inicial si ya hay datos, seguida de una sincronización silenciosa (y mejora la robustez si no hay backend).

**2. Mapeo de Historial**
- *Decisión*: La API devuelve un formato distinto (`id`, `perfilFinanciero`, `fechaAnalisis`, `transacciones`, `categorias`, `recomendaciones`). Usaremos una función local (o en `mapeadores.ts`) para convertirlo. Los campos que el backend no retorna (ej. `puntajeSalud`, `totalGastado`) se inferirán localmente a través de cálculos simples (ej. sumando transacciones, o asumiendo defaults lógicos).

## Riesgos / Trade-offs

- **[Riesgo]** La API `historial` no devuelve metadatos como `puntajeSalud`, lo que podría resultar en un `0` en la UI.
  - **Mitigación**: Se calculará un puntaje localmente o se asignará un valor base según el `perfilFinanciero` (ej. Saludable = 90, Estable = 75, Riesgo = 40) para mantener la UX rica mientras se propone mejorar el backend a futuro.

## Estados y Propiedades (React)

```typescript
// Estados modificados en HistoryView.tsx
const [historialLocal, setHistorialLocal] = useState<ReporteAnalisis[]>(analysisHistory);
const [cargandoHistorial, setCargandoHistorial] = useState(true);
const [busqueda, setBusqueda] = useState('');
const [filtroSalud, setFiltroSalud] = useState<'all' | HealthStatus>('all');
const [ordenarPor, setOrdenarPor] = useState<'newest' | 'oldest' | 'score-high' | 'score-low'>('newest');
```
