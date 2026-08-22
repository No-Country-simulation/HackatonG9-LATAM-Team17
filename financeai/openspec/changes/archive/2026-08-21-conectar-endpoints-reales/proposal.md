## Why

Actualmente, el frontend intenta conectarse a múltiples rutas (`/api/profile`, `/api/transactions`, `/api/account`, `/api/categorize`) que no están mapeadas en el proxy de Vite (`/api/v1/...`) ni existen en el backend real de Spring Boot. Esto causa errores explícitos (como el error `Unexpected token '<'`) y silenciosos debido a que Vite devuelve su `index.html` de fallback en lugar de un JSON válido. Es crítico limpiar estos falsos endpoints para asegurar la estabilidad, conectando las funciones con los endpoints reales que sí existen y proveyendo un flujo exclusivo de frontend (state local) para los que aún no están soportados por el backend.

## What Changes

- **Conexión de Perfil:** Modificar `handleUpdateProfile` en `App.tsx` para que consuma `PUT /api/v1/auth/usuarios/{id}` en lugar del mock `/api/profile`.
- **Eliminación de Cuenta:** Modificar `handleDeleteAccount` en `App.tsx` para que consuma `DELETE /api/v1/auth/eliminar?email={email}`.
- **Manejo de Transacciones (Simulado en memoria):** Dado que el backend actual no cuenta con un CRUD explícito de transacciones independientes (solo viajan dentro del POST `/analizar`), se **eliminarán** los intentos de `fetch` a `/api/transactions` en `handleAddTransaction`, `handleDeleteTransaction` y en la carga inicial de `App.tsx`. Todo el manejo de transacciones operará exclusivamente en la memoria (estado de React).
- **Categorización:** Remover el intento de `fetch` a `/api/categorize` en `utils/categorizer.ts`, para prevenir el error silencioso, confiando completamente en la categorización local o en los endpoints reales ya integrados (como `/api/v1/finanzas/clasificar`).

## Capabilities

### New Capabilities
- `frontend-mocks-cleanup`: Eliminación de peticiones HTTP a rutas inexistentes, estabilizando el uso de estados locales para entidades sin CRUD en backend (ej. transacciones).
- `profile-backend-connection`: Vinculación de las acciones de edición y eliminación de cuenta con los endpoints reales de Spring Boot v1.

### Modified Capabilities

## Impact

- **App.tsx:** Refactorización de las funciones de carga inicial (`useEffect`), `handleUpdateProfile`, `handleDeleteAccount`, `handleAddTransaction` y `handleDeleteTransaction`.
- **utils/categorizer.ts:** Simplificación de `requestAiCategorization`.
- **Sugerencia para versión futura (Backend):** Se recomienda que el backend implemente un CRUD completo de transacciones individuales por usuario (`/api/v1/transacciones`) para que el usuario no pierda su registro al recargar la página.
