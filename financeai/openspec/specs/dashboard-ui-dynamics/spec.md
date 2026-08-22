# Capability: Dashboard UI Dynamics

## Purpose
TBD - Add dynamic and responsive behaviors to the Dashboard UI, such as dynamic dates, real synchronization banners, and historical aggregations.

## Requirements

### Requirement: Fecha Dinámica en Dashboard
El Dashboard MUST mostrar la fecha actual del sistema en español en lugar de una fecha estática.

#### Scenario: Visualización de fecha actual
- **WHEN** el componente `DashboardView` se renderiza
- **THEN** la interfaz muestra el día, mes y año actual (ej: "15 de Octubre, 2024") generado en tiempo real.

### Requirement: Sincronización Real del Banner
El banner de error de sincronización MUST mostrarse únicamente cuando existe un fallo real de conexión (proveniente de un estado global de red o historial), y el banner de éxito MUST mostrarse únicamente como una alerta efímera post-análisis.

#### Scenario: Fallo de conexión
- **WHEN** la aplicación global detecta un error de conexión al cargar datos
- **THEN** el Dashboard muestra el banner de "Error de conexión" con el botón de "Reintentar".

#### Scenario: Sincronización exitosa tras análisis
- **WHEN** el usuario completa la generación de un nuevo reporte
- **THEN** se muestra efímeramente la alerta de "¡Sincronización exitosa!" antes de desvanecerse.

### Requirement: Distribución de Gastos Mensual
La sección de "Distribución de Gastos" del Dashboard MUST sumarizar los totales de gastos (por categoría) de TODOS los análisis reportados para el mes actual, en lugar de usar solamente el último análisis.

#### Scenario: Agregación histórica de un mes
- **WHEN** el Dashboard recibe un historial de análisis de un mes específico
- **THEN** se suman los montos por categoría de todos esos reportes
- **AND** los porcentajes de la gráfica de barras reflejan la proporción de cada categoría frente al total acumulado mensual.

### Requirement: Corrección Semántica de Probabilidad
La etiqueta textual bajo el puntaje principal del Dashboard MUST leerse "Confianza de la IA" o "Certeza del modelo", reflejando el significado real del dato según la API, en lugar de "Probabilidad de mejora financiera".

#### Scenario: Renderizado del Puntaje
- **WHEN** se pinta el puntaje (ej. 78%) en la interfaz
- **THEN** el subtítulo descriptivo debajo indica claramente "Nivel de confianza de IA" (o equivalente) garantizando coherencia semántica.
