## Why

Actualmente, el flujo de inicio de sesión y registro enfrenta bloqueos críticos y de experiencia de usuario. Primero, el middleware `express.json()` en el servidor de desarrollo (`server.ts`) consume el stream de la petición antes de que el proxy de Vite la envíe al backend, causando que el servidor Tomcat aborte con `SocketTimeoutException`. Segundo, la barrera de autenticación renderiza un modal sobre cualquier ruta actual (ej. `/historial`), lo cual resulta confuso; es preferible una redirección explícita a la ruta `/login`. Tercero, botones como "Continuar con Google" y "¿Olvidaste tu contraseña?" tienen atajos (mocks) que inician sesión automáticamente, representando una brecha de seguridad. Por último, el frontend necesita alinearse con la reciente actualización del backend que ya emite códigos 401 (Credenciales inválidas) y 409 (Email duplicado), eliminando antiguos workarounds.

## What Changes

- **BREAKING (Ruteo)**: Implementación de la ruta estricta `/login`. Si no hay usuario activo, la aplicación usará React Router para ejecutar `navigate('/login')` en vez de superponer el modal sobre la ruta actual.
- Modificación de `server.ts` para asegurar que el middleware `express.json()` no intercepte el flujo de las peticiones destinadas a `/api/*`, resolviendo el problema de conectividad del proxy.
- Actualización de `LoginModal.tsx` para remover el *mock* de acceso en los botones de "Google" y "Contraseña", mostrando en su lugar alertas de "Funcionalidad no implementada".
- Actualización del archivo `apiErrors.ts` para soportar explícitamente el código 401 y procesar el 409 nativo sin depender del parseo de cadenas en el error 500.

## Capabilities

### New Capabilities
- `ruteo-autenticacion-explicito`: Introducir un ruteo directo hacia `/login` garantizando consistencia en la URL durante el bloqueo de acceso.

### Modified Capabilities
- `restriccion-acceso`: Modificación del comportamiento de la barrera de acceso. En lugar de ocultar la UI subyacente y montar el modal, ahora redirigirá físicamente a la ruta de inicio de sesión.

## Impact

- `server.ts`: Resolución del fallo I/O en desarrollo (Proxy).
- `App.tsx`: Transformación de la arquitectura SPA de *Render-Blocking modal* a un sistema de rutas privadas/públicas estándar.
- `LoginModal.tsx`: Sellado de puertas traseras (*mocks*) y mejora de fiabilidad.
- `apiErrors.ts`: Limpieza de deuda técnica acorde a la especificación de `EXCEPCIONES_BACKEND.md`.
