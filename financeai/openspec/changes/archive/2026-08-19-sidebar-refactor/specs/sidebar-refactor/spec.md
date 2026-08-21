## ADDED Requirements

### Requirement: Nomenclatura Estricta al Español
- El componente `Sidebar` DEBE mantener todos sus variables internas traducidas idiomáticamente (camelCase) tales como: `elementosNavegacion`, `manejarClicPestana`, `manejarClicNuevoAnalisis`, `manejarClicLogin`, `contenidoSidebar`.

#### Scenario: Interacciones del Menú Traducidas
- **GIVEN** que el usuario hace clic en el botón de cerrar sesión.
- **WHEN** se dispara el manejador de clics `manejarClicLogin`.
- **THEN** se ejecutan las mismas operaciones originales garantizando que el diseño visual opere sin cambios.
