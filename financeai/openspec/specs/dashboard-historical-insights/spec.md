# Capability: Dashboard Historical Insights

## Purpose
TBD - Add historical insights and timeline viewing capabilities to the Dashboard.

## Requirements

### Requirement: Recomendaciones Históricas Aleatorias
El Dashboard MUST extraer las recomendaciones disponibles de todos los reportes previos y mostrar una selección representativa (1 recomendación elegida aleatoriamente por cada análisis en el historial).

#### Scenario: Visualización del panel de recomendaciones
- **WHEN** el usuario visualiza el Dashboard con al menos 2 análisis históricos
- **THEN** se muestra una lista de recomendaciones, extrayendo una sola de forma aleatoria por cada reporte
- **AND** cada elemento de recomendación indica claramente a qué análisis o fecha pertenece (ej. "Recomendación del análisis de 12 Oct").

### Requirement: Modal de Historial de Reportes (Timeline)
El sistema MUST proporcionar un punto de acceso desde el Dashboard hacia un listado completo (historial) de los análisis realizados.

#### Scenario: Clic en "Ver reporte completo"
- **WHEN** el usuario hace clic en el enlace "Ver reporte completo" de la sección de Recomendaciones
- **THEN** el sistema abre el `AnalysisTimelineModal` en lugar del detalle individual directo
- **AND** se listan todos los reportes cronológicamente para que el usuario pueda seleccionar cualquiera y ver su detalle.
