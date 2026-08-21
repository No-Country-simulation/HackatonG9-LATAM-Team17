## ADDED Requirements

### Requirement: Autenticación Mandatoria
El sistema DEBE impedir el acceso a cualquier vista interna (Dashboard, Historial, Nuevo Análisis) si el usuario no ha completado el inicio de sesión. Ningún dato ficticio o parcial debe ser expuesto.

#### Scenario: Usuario no autenticado accede a la aplicación
- **WHEN** un usuario no autenticado abre la aplicación
- **THEN** la aplicación debe mostrar la pantalla de Login a pantalla completa, bloqueando la visibilidad del Dashboard subyacente.

### Requirement: Bloqueo Visual durante la Validación
El sistema DEBE proveer un estado de carga global visualmente atractivo (Loader) mientras se comprueba el estado de la sesión en el inicio, previniendo parpadeos de la UI (FOUC).

#### Scenario: App se inicializa y comprueba la sesión
- **WHEN** la aplicación se carga por primera vez
- **THEN** la interfaz principal (Sidebar, Topbar) se oculta y en su lugar se muestra una pantalla de carga a pantalla completa hasta recibir respuesta del backend.
