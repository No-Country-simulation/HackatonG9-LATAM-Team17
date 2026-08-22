## ADDED Requirements

### Requirement: Erradicación del concepto de Salud Financiera e independización de la Confianza
El sistema SHALL mostrar explícitamente el porcentaje de confianza de la IA y el perfil financiero como dos conceptos separados, erradicando la terminología "Salud Financiera" para evitar interferencia cognitiva.

#### Scenario: Visualización del detalle del análisis
- **WHEN** el usuario abre el modal de detalles de un análisis finalizado
- **THEN** el sistema etiqueta el estado como "Perfil Financiero" y el porcentaje devuelto como "Confianza de IA" o "Confianza del Modelo", presentándolos de forma independiente.

#### Scenario: Visualización de historial de análisis
- **WHEN** el usuario revisa su historial de reportes en una tabla o línea de tiempo
- **THEN** el perfil financiero y el nivel de confianza deben diferenciarse visualmente.

### Requirement: Independencia de la representación gráfica del estado
El sistema SHALL vincular los componentes visuales de estado (como la expresión de la mascota) al "Perfil Financiero" real del usuario y no al porcentaje matemático de confianza de la predicción.

#### Scenario: Usuario con estado saludable y modelo con baja confianza
- **WHEN** el reporte establece el perfil como "Saludable" pero con una confianza del 40%
- **THEN** la interfaz muestra a la mascota con expresión positiva correspondiente a "Saludable", ignorando el bajo porcentaje de la predicción estadística.
