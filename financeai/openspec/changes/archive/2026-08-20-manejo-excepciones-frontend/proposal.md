## Why

Actualmente, el frontend maneja los errores HTTP usando un `.catch(() => {})` genérico (silencioso) en la mayoría de sus llamadas `fetch`, o mostrando mensajes genéricos sin tomar en cuenta la rica estructura de excepciones que envía el backend. Es indispensable implementar un manejo de excepciones centralizado basado en `docs/EXCEPCIONES_BACKEND.md` para proporcionar una experiencia de usuario clara, indicando exactamente qué falló (ej. errores de validación por campo, fallos temporales del motor de IA, o conflictos de datos).

## What Changes

- Creación de un servicio utilitario de manejo de errores HTTP (`apiErrorHandler.ts`) que mapea los status (400, 404, 409, 415, 502, 503, 500) y parsea los DTOs de error (`ErrorResponseDTO`, `DataErrorResponseDTO`, `PythonServiceErrorDTO`).
- Modificación de los `fetch` en `App.tsx`, `SettingsProfileView.tsx`, y `NewAnalysisView.tsx` para usar este servicio en lugar del silencioso `.catch()`.
- Implementación de notificaciones de error visibles (UI) en los formularios, resaltando campos en errores 400 y usando notificaciones globales (toast o banners) para 500, 502 y 503.
- Inclusión del manejo de "Casos Especiales" para `AuthService` cuando lanza 500 para credenciales inválidas o correo duplicado (analizando el string del mensaje).
- Se documentarán como sugerencias para una futura versión las excepciones que el backend aún no gestiona correctamente (errores 500 en Auth que deberían ser 401/409, y 404 estructurado diferente en `/eliminar`).

## Capabilities

### New Capabilities
- `manejo-excepciones`: Implementación de captura, transformación y despliegue en interfaz de los códigos HTTP de error y mensajes provenientes del backend de Java, incluyendo validación por campo.

### Modified Capabilities


## Impact

- **Frontend Code**: Afecta principalmente a la capa de integración de red (`fetch` calls en componentes de React).
- **UX/UI**: Mejora sustancial en la UX al tener feedback real en formularios en lugar de clics sin respuesta. Se usarán componentes visuales premium del proyecto para mostrar los errores (manteniendo el diseño actual).
- **Backend APIs**: Ningún impacto (el backend no se toca, solo nos adaptamos a su contrato actual).
