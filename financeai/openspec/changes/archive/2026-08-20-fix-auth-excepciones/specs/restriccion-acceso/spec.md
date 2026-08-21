## MODIFIED Requirements

### Requirement: Autenticación Mandatoria
El sistema DEBE impedir el acceso a cualquier vista interna (Dashboard, Historial, Nuevo Análisis) si el usuario no ha completado el inicio de sesión. La pantalla de autenticación a pantalla completa DEBE activarse si y sólo si el perfil del usuario actual es estrictamente `null`, sin depender de otras variables de estado locales booleanas. Ningún dato ficticio o parcial debe ser expuesto en caso de fallo de autenticación de API, revirtiendo siempre al estado nulo.

#### Scenario: Usuario no autenticado accede a la aplicación
- **WHEN** un usuario no autenticado abre la aplicación o se detecta que su sesión expiró (error 401)
- **THEN** la aplicación debe vaciar los datos sensibles y el perfil del usuario (asignando `null`), lo cual dispara la aparición obligada de la pantalla de Login a pantalla completa, bloqueando la visibilidad del Dashboard subyacente.
