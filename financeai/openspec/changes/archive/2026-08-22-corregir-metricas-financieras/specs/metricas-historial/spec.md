## ADDED Requirements

### Requirement: Incorporación de los 6 Estados
El sistema SHALL reconocer y procesar correctamente los 6 estados enviados por el backend: Excelente, Saludable, Estable, En observación, En riesgo y Crítico.

#### Scenario: Visualización de los filtros en Historial
- **WHEN** el usuario navega a la vista de Historial
- **THEN** observa botones de filtro exclusivos para cada uno de los 6 estados (Crítico, En riesgo, En observación, Estable, Saludable, Excelente) junto a la opción "Todos".

### Requirement: Normalización de los estados crudos
El sistema SHALL unificar variaciones enviadas por el backend ("Observación", "Riesgo") hacia sus correspondientes estrictos ("En observación", "En riesgo").

#### Scenario: Filtro consistente de Observación
- **WHEN** el backend envía reportes históricos marcados con el estado "Observación"
- **THEN** el sistema los mapea internamente a "En observación" y los muestra al clickear el filtro "En observación".

### Requirement: Promedio de Salud por Asignación
El sistema SHALL calcular la "Salud Promedio" matemática usando la asignación de perfiles (Excelente=100, Saludable=80, Estable=60, En observación=40, En riesgo=20, Crítico=0) en vez de sumar la probabilidad arrojada por la IA.

#### Scenario: Promedio real de salud
- **WHEN** el usuario tiene un historial de dos análisis (Excelente y En observación)
- **THEN** la "Salud Promedio" exhibida en la tarjeta es de 70%.
