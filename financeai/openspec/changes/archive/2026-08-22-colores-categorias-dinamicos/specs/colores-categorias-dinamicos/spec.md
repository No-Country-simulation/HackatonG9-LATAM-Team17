## ADDED Requirements

### Requirement: Asignación dinámica de colores
El sistema SHALL asignar un color de contraste alto a cualquier categoría de gasto nueva que la IA genere.

#### Scenario: Categoría nueva
- **WHEN** la API devuelve una categoría "Seguros" que no estaba en la paleta predefinida
- **THEN** el sistema extrae el siguiente color disponible y lo asocia permanentemente a "Seguros" durante la sesión

### Requirement: Consistencia visual en toda la aplicación
El sistema SHALL garantizar que una categoría tenga el mismo color exacto en el Dashboard y en Reportes.

#### Scenario: Navegación entre vistas
- **WHEN** el usuario navega del Dashboard a Informes
- **THEN** el color que representa "Vivienda" es exactamente el mismo en ambas pantallas
