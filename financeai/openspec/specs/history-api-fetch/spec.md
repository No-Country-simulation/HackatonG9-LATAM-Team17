# history-api-fetch

## Purpose
TBD

## ADDED Requirements

### Requirement: Sincronización de Historial con el Backend
El sistema DEBE hacer una petición al endpoint `GET /api/v1/finanzas/historial` para recuperar el historial de análisis real del usuario.

#### Scenario: Carga exitosa del historial
- **WHEN** el componente `HistoryView` se monta
- **THEN** inicia una petición a `GET /api/v1/finanzas/historial`
- **THEN** si la petición es exitosa, mapea los datos devueltos (agregando campos calculados faltantes como puntaje o totales)
- **THEN** actualiza la lista visualizada con los nuevos datos provenientes del backend.

#### Scenario: Fallo al cargar historial
- **WHEN** la petición a `GET /api/v1/finanzas/historial` falla (red caída o error de servidor)
- **THEN** el sistema hace un _fallback_ silencioso utilizando la lista de análisis provista localmente mediante props (`analysisHistory`).

### Requirement: Traducción de variables de filtro al español
El sistema DEBE utilizar nombres de variables en español (`camelCase`) para los estados y funciones de filtrado, búsqueda y ordenamiento de historial.

#### Scenario: Filtrado de historial
- **WHEN** el usuario selecciona opciones de filtros o búsqueda
- **THEN** los valores se almacenan y procesan utilizando variables como `busqueda`, `filtroSalud`, y `ordenarPor` para garantizar consistencia con las convenciones.

