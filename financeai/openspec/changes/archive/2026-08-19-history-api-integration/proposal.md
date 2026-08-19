## Why

El componente `HistoryView.tsx` actualmente recibe el historial de análisis como un *prop* (`analysisHistory`) desde un componente superior. Sin embargo, para aislar la responsabilidad de la vista y conectarla directamente con el backend documentado, se requiere consumir el endpoint `GET /api/v1/finanzas/historial` directamente desde el `HistoryView.tsx`.
Además, el componente posee estados internos con nombres en inglés (`searchQuery`, `statusFilter`, `sortBy`) que deben ser traducidos al español para mantener el cumplimiento de las convenciones de Nomenclatura del proyecto.

## User Review Required

**⚠️ ADVERTENCIA: Cambio de idioma y nombres de variables en el componente**
Siguiendo la regla global, propongo renombrar las variables del estado y funciones internas de `HistoryView.tsx`:
- `searchQuery` -> `busqueda`
- `statusFilter` -> `filtroSalud`
- `sortBy` -> `ordenarPor`
- `filteredHistory` -> `historialFiltrado`
- `stats` -> `estadisticas`
- `getStatusBadge` -> `obtenerInsigniaSalud`
¿Apruebas este renombramiento para todo el estado interno del componente?

## What Changes

- **Integración API Local:** Se añadirá un `useEffect` en `HistoryView.tsx` que hará un `fetch` a `GET /api/v1/finanzas/historial` al montarse el componente (y opcionalmente a través de un botón de recarga oculto o de uso silencioso).
- **Mapeo de Datos:** Dado que la API devuelve un arreglo con estructura diferente al `ReporteAnalisis` esperado por el frontend, se implementará o reutilizará un mapeador (`mapeadores.ts`) para transformar la respuesta de la API al formato `ReporteAnalisis`.
- **Renombramiento de Variables:** Se traducirá el estado local de filtros y búsquedas al español.
- **Sugerencias Futuras:** Actualmente la API de historial no incluye todos los cálculos de puntaje que el frontend genera (ej. `puntajeSalud`, `totalGastado`). Se sugerirá para una versión futura del backend que el historial provea toda la metadata calculada, para evitar que el frontend deba inferirla.
- **Mantenimiento del Diseño:** Se conservará íntegramente la interfaz (TailwindCSS, iconos de Lucide-React, estructura de tablas/tarjetas).

## Capabilities

### New Capabilities
- `history-api-fetch`: Conexión de la vista de historial de análisis con el endpoint GET del backend para cargar datos frescos, mapeando el DTO devuelto al modelo `ReporteAnalisis` del frontend.

### Modified Capabilities

## Impact

- `src/components/HistoryView.tsx`: Se agregará estado local de carga (`cargandoHistorial`) y se cambiará el flujo de datos para preferir la API por encima de los *props*, o bien inicializar el estado local usando la API.
- Se mantendrán las restricciones de no alterar el backend.
