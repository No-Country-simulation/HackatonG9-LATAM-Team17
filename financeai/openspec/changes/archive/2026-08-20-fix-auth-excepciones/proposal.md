## Why

Durante la implementación previa de la propuesta de manejo de excepciones y la de protección de rutas sin mocks, se generó un conflicto arquitectónico crítico en la gestión de estado de autenticación. `App.tsx` está manejando las fallas de sesión (error 401) asignando un perfil de usuario ficticio (`defaultProfile`) en lugar de `null`. Esto choca con la nueva barrera de ruteo, la cual solo renderiza la pantalla completa de inicio de sesión cuando `userProfile` es estrictamente `null`. Como resultado, si la sesión expira o es rechazada, la UI omite la barrera de seguridad y queda bloqueada en un Dashboard ficticio inoperable, sin permitir al usuario iniciar sesión nuevamente de forma fluida.

## What Changes

- Modificación de `fetchConManejo` en `App.tsx` para que en caso de error 401 asigne de forma estricta `setUserProfile(null)` en lugar de cargar un perfil de emergencia con "Usuario".
- Remoción de la asignación de perfil falso en `handleDeleteAccount`, asegurando que también establezca el estado en `null`.
- Eliminación de todas las referencias y el setter local `setShowLoginModal` (y su variable de estado) dentro del `MainApp`, ya que actualmente representa código muerto: el renderizado del `LoginModal` fue extraído a la capa superior como un bloqueo de pantalla (Render-Blocking) condicionado únicamente a la nulidad de `userProfile`.

## Capabilities

### New Capabilities

- `reconciliacion-auth-excepciones`: Garantizar que los estados asíncronos de error de autenticación fluyan correctamente hacia el mecanismo global de rutas protegidas.

### Modified Capabilities

- `restriccion-acceso`: Modificación menor a la especificación de cierre de sesión (o expiración) para que el disparador sea puramente el vaciado de variables y no controles de visibilidad anidados.

## Impact

- `App.tsx`: Refactorización de las secuencias de desconexión y fallos de API. Reducción de la complejidad de estados locales al remover `showLoginModal`.
- **UX**: Retorno absoluto de la coherencia. Si un usuario tiene su cuenta vencida, será interceptado por el modal de validación a pantalla completa sin parpadeos ni "mockups" atrapantes, garantizando un flujo premium.
