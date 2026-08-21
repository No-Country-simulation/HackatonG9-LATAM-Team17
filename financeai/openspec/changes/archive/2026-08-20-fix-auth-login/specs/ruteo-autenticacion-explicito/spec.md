## ADDED Requirements

### Requirement: Navegación Explícita a Pantalla de Acceso
El sistema MUST asegurar que las funciones de inicio de sesión residan en una ruta (URL) designada, típicamente `/login`, aislando la lógica de sesión de las rutas del sistema para evitar ambigüedades en el enrutamiento y favorecer flujos claros.

#### Scenario: Acceso directo a URL no autenticado
- **WHEN** el usuario navega directamente a `/historial` sin tener sesión iniciada
- **THEN** la aplicación ejecuta una redirección explícita a la ruta `/login`, actualizando la barra de direcciones del navegador.

### Requirement: Bloqueo Funcionalidades No Implementadas
El sistema MUST deshabilitar o alertar adecuadamente sobre aquellos puntos de acceso que aún carecen de implementación técnica en el backend (ej. OAuth de Google, Recuperación de contraseña), previniendo que actúen como simulacros (mocks) inseguros.

#### Scenario: Clic en Continuar con Google
- **WHEN** un usuario hace clic en "Continuar con Google"
- **THEN** la aplicación no inicia sesión automáticamente y en su lugar muestra una advertencia visual indicando que la funcionalidad no está disponible.
