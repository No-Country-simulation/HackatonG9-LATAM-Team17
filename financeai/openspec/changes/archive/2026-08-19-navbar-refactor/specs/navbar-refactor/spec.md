## ADDED Requirements

### Requirement: Nomenclatura Estricta al Español
- El componente `TopNavbar` DEBE mantener todos sus literales y variables de React Estado (`useState`) traducidas idiomáticamente (camelCase) tales como: `mostrarNotificaciones`, `mostrarMenuUsuario`, `busqueda`.

#### Scenario: Interacciones del Menú Traducidas
- **GIVEN** que el usuario hace clic en el botón de notificaciones.
- **WHEN** se dispara el manejador de clics.
- **THEN** la nueva variable `mostrarNotificaciones` se alterna (toggle).
- **THEN** la variable `mostrarMenuUsuario` se setea a falso garantizando que el diseño visual opere sin cambios.
