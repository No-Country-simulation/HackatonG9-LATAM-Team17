## MODIFIED Requirements

### Requirement: Autenticación Mandatoria
El sistema DEBE impedir el acceso a cualquier vista interna (Dashboard, Historial, Nuevo Análisis) si el usuario no ha completado el inicio de sesión. Ningún dato ficticio o parcial debe ser expuesto. La protección debe garantizar que la aplicación reaccione a este estado redireccionando al usuario físicamente a la ruta `/login`.

#### Scenario: Usuario no autenticado accede a la aplicación
- **WHEN** un usuario no autenticado abre la aplicación en una ruta protegida
- **THEN** la aplicación intercepta la carga y usa React Router para ejecutar una redirección (`navigate`) a la ruta `/login`, reemplazando el historial para no atrapar al usuario en un loop de "Back".
