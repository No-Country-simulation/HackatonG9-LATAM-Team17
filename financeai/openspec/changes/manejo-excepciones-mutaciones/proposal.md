## Why

Existen agujeros críticos en el manejo de excepciones de operaciones clave en el frontend, lo cual causa un "Falso Optimismo" en el estado de la UI cuando el backend falla (por ejemplo, errores 500 o tokens expirados 401). Las acciones de agregar, eliminar y actualizar asumen éxito incondicional, dejando el estado local corrupto e inconsistente con el backend. Además, componentes como `HistoryView` están haciendo llamadas a URLs absolutas (`http://localhost:8080`) que evaden el proxy de Vite, lo que causará fallos de CORS en producción, y la carga inicial en `App.tsx` ignora las caídas de red, mostrando estados predeterminados en vez de solicitar re-autenticación.

## What Changes

- Manejo estricto de excepciones en los efectos iniciales de `App.tsx` (carga de perfil, transacciones, historial).
- Manejo de excepciones en todas las mutaciones: agregar/eliminar transacción, actualizar perfil.
- Corrección de la URL absoluta en `HistoryView.tsx` y `DashboardView.tsx` para usar las rutas relativas del proxy de Vite (`/api/v1/finanzas/...`).
- Integración de `manejarRespuestaError` de `apiErrors.ts` en `App.tsx` e `HistoryView.tsx` para procesar y presentar adecuadamente la retroalimentación visual al usuario en caso de falla.

## Capabilities

### New Capabilities
- `manejo-excepciones-global`: Se introduce el control global de excepciones y validación de sesión (401) en operaciones de ciclo de vida e interacciones.
- `correccion-enrutamiento-proxy`: Reestructuración de llamadas `fetch` para garantizar el uso estricto del proxy interno.

### Modified Capabilities
- 

## Impact

- `App.tsx`: Se modificarán todos los bloques `fetch` (GETs de inicialización, POST/PUT/DELETE de mutaciones).
- `HistoryView.tsx`: Cambio de URL de fetch y captura visual del error (manejo del Empty State o Toast de error).
- `DashboardView.tsx`: Corrección de `${API_BASE_URL}` en el quick add.
- UX: El usuario verá alertas visuales si falla una operación, en vez de visualizar cambios fantasma, y la aplicación solicitará un nuevo inicio de sesión si se detecta un 401.
