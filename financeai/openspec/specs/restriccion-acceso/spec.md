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


<!-- Merged from fix-auth-login -->
## MODIFIED Requirements

### Requirement: Autenticación Mandatoria
El sistema DEBE impedir el acceso a cualquier vista interna (Dashboard, Historial, Nuevo Análisis) si el usuario no ha completado el inicio de sesión. Ningún dato ficticio o parcial debe ser expuesto. La protección debe garantizar que la aplicación reaccione a este estado redireccionando al usuario físicamente a la ruta `/login`.

#### Scenario: Usuario no autenticado accede a la aplicación
- **WHEN** un usuario no autenticado abre la aplicación en una ruta protegida
- **THEN** la aplicación intercepta la carga y usa React Router para ejecutar una redirección (`navigate`) a la ruta `/login`, reemplazando el historial para no atrapar al usuario en un loop de "Back".


<!-- Merged from fix-auth-excepciones -->
## MODIFIED Requirements

### Requirement: Autenticación Mandatoria
El sistema DEBE impedir el acceso a cualquier vista interna (Dashboard, Historial, Nuevo Análisis) si el usuario no ha completado el inicio de sesión. La pantalla de autenticación a pantalla completa DEBE activarse si y sólo si el perfil del usuario actual es estrictamente `null`, sin depender de otras variables de estado locales booleanas. Ningún dato ficticio o parcial debe ser expuesto en caso de fallo de autenticación de API, revirtiendo siempre al estado nulo.

#### Scenario: Usuario no autenticado accede a la aplicación
- **WHEN** un usuario no autenticado abre la aplicación o se detecta que su sesión expiró (error 401)
- **THEN** la aplicación debe vaciar los datos sensibles y el perfil del usuario (asignando `null`), lo cual dispara la aparición obligada de la pantalla de Login a pantalla completa, bloqueando la visibilidad del Dashboard subyacente.
