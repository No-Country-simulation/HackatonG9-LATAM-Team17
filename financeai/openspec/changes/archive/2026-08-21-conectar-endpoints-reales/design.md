## Context

La aplicación React actualmente contiene llamadas `fetch` a endpoints que no existen ni en el proxy de Vite (`/api/v1/...`) ni en el backend de Spring Boot (por ejemplo `/api/profile`, `/api/transactions`, `/api/account`). Al no coincidir con el proxy, Vite intercepta estas peticiones como si fueran rutas del SPA y devuelve el archivo `index.html` (HTTP 200). El frontend asume que es una respuesta válida, intenta parsearla como JSON mediante `.json()`, y se genera un error del tipo `Unexpected token '<', "<!doctype "... is not valid JSON`.

## Goals / Non-Goals

**Goals:**
- Conectar la edición y eliminación de cuenta de usuario en `App.tsx` con los verdaderos endpoints documentados del backend (`/api/v1/auth/...`).
- Eliminar completamente las llamadas `fetch` ficticias para agregar y eliminar transacciones (`handleAddTransaction`, `handleDeleteTransaction`), manejando estos eventos exclusivamente a través de la actualización del estado local de React.
- Limpiar el código de categorización IA (`utils/categorizer.ts`) para no intentar un `fetch` a rutas en desuso (`/api/categorize`).

**Non-Goals:**
- No se modificará el backend.
- No se añadirá persistencia avanzada (como IndexedDB/localStorage) para transacciones en este cambio, se confía en la retención en memoria (estado actual) y en el envío por baches durante el análisis.

## Decisions

### 1. Transacciones gestionadas puramente en memoria
**Decisión:** Eliminar las llamadas a la API en `handleAddTransaction`, `handleDeleteTransaction` y en la carga inicial de transacciones de `App.tsx`.
**Razón:** El backend no tiene un controlador ni persistencia separada para transacciones (solo viven como un objeto anidado dentro de un reporte en `/analizar`). Realizar llamadas ficticias genera errores silenciosos.
**Implementación:** Las funciones actualizarán directamente el estado `transactions` sin lanzar ninguna promesa `fetch`. 

### 2. Actualización inteligente de perfil
**Decisión:** Enlazar `handleUpdateProfile` al endpoint `PUT /api/v1/auth/usuarios/{id}`.
**Razón:** Para que la edición de perfil (nombre y email) funcione y se mantenga consistente en la BD real.
**Trade-off:** El endpoint backend *solo* soporta modificar `nombre` y `email`. Pero el frontend usa el mismo `handleUpdateProfile` para actualizar métricas financieras (ej: ingreso mensual en el Onboarding). Por tanto, la función debe enviar un `PUT` al backend **solo si** hay cambios en `nombre` o `email`. Si se actualizan métricas (ej. `localOnly = true`), solo se modificará el estado en memoria.

### 3. Eliminar cuenta de usuario
**Decisión:** Enlazar `handleDeleteAccount` a `DELETE /api/v1/auth/eliminar?email={email}`.
**Razón:** Reemplazar el inoperativo `/api/account`.
**Consideración:** Se extraerá el `email` del estado `userProfile` actual. El backend actualmente no maneja borrado en cascada (arroja `409` si hay análisis). Si falla, se deberá notificar en el `setErrorGlobal`.

## Risks / Trade-offs

- **[Risk]** Si el usuario intenta eliminar su cuenta pero ya ha realizado un análisis, el backend fallará con 409 (Foreign Key Constraint).
  - **Mitigation:** Se capturará este posible error en el `.catch` de `handleDeleteAccount` y se lanzará con un mensaje amigable al usuario (ej. "No es posible eliminar la cuenta porque ya tienes un historial asociado.") asignándolo a `errorGlobal`.
