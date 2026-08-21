# Capability: reconciliacion-auth-excepciones

## ADDED Requirements

### Requirement: Purga absoluta de estado en caso de error de autenticación
El sistema MUST asegurar que cualquier interceptación de un error 401 (Unauthorized) desde los servicios del backend desemboque invariablemente en la purga absoluta del perfil de usuario (`userProfile = null`) y de los datos locales sensibles, en lugar de recurrir a objetos falsos de recuperación.

#### Scenario: Intercepción de 401 durante la carga de datos iniciales
- **WHEN** las peticiones concurrentes iniciales (`/api/profile`, `/api/transactions`, etc.) devuelven un código HTTP 401
- **THEN** el sistema vacía el arreglo de transacciones, el historial y asigna estrictamente `null` al perfil de usuario, disparando el renderizado de la barrera estricta del Login a pantalla completa.

### Requirement: Flujo unificado de inicio de sesión
El sistema MUST gobernar la presentación del formulario de inicio de sesión únicamente por la ausencia de un perfil de usuario activo (`userProfile === null`). No deberán existir controladores booleanos secundarios (como `showLoginModal`) para forzar este estado.

#### Scenario: Solicitud de cierre de sesión o fallo
- **WHEN** el usuario cierra sesión explícitamente, o el token expira pasivamente
- **THEN** la aplicación destruye la variable local de usuario y automáticamente la raíz del sistema devuelve la interfaz de inicio de sesión sin parpadeos ni fondos falsos.
