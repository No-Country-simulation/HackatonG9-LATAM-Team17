## Technical Approach

### 1. Servicio de Parseo de Errores (`src/utils/apiErrorHandler.ts`)
Crearemos una función asíncrona `manejarRespuestaError(response: Response)` que consumirá el cuerpo de la respuesta en formato JSON. Esta función ejecutará un `switch` evaluando `response.status`:
- **400**: Retorna `validation_errors` como un objeto si existe, de lo contrario `message`.
- **404**: Manejo del caso de `DELETE /eliminar` que devuelve `error` y para el resto `message`.
- **409**: Retorna `detail` prioritariamente y si no, hace un fallback a `message`.
- **415**: Mensaje harcodeado de "Formato no soportado".
- **502 / 503**: Mensaje amigable para reintentos del servicio de IA.
- **500**: Aquí implementaremos la inspección estricta de la propiedad `message` para detectar los "Casos especiales de AuthService" (email duplicado, credenciales inválidas). 
La función retornará un objeto estructurado: `{ general: string, validationErrors?: Record<string, string>, retryable?: boolean }`.

### 2. Estado Global de Errores de UI
Para notificar al usuario, usaremos el mismo diseño premium que ya maneja la aplicación, probablemente introduciendo alertas rojas con Tailwind CSS para mostrar `general` en la cima de un formulario, y asociando los errores de `validationErrors` a los `<input>` correspondientes mostrando el texto debajo del campo afectado en texto `#ba1a1a` o similar.

### 3. Ajustes de Código React
- En `App.tsx`, las funciones `handleAddTransaction`, `handleDeleteTransaction`, `handleUpdateProfile`, etc., implementarán manejo de promesas con async/await (o una mejora de `.then/.catch`) llamando a `manejarRespuestaError` y notificando visualmente el fallo, para no fallar silenciosamente.
- En `SettingsProfileView.tsx`, se gestionará en el formulario básico la visualización del error de credenciales/email. En el modal de eliminar, se mostrará el error si hay análisis dependientes (status 409).
- En `NewAnalysisView.tsx`, en vez de imprimir a consola, desplegaremos el mensaje del motor en pantalla cuando dé error 502/503.

## Data Models / Schema Changes
Ninguno (el backend se mantiene intacto). El DTO interpretado se apega al `ErrorResponseDTO` ya definido.

## Edge Cases
- **Fetch falla por red (offline)**: Atraparemos el `TypeError: Failed to fetch` en un `try-catch` y propondremos un error genérico de "Falla de conexión".
- **Backend devuelve JSON inválido**: `response.json()` puede tirar excepción; usaremos un `.catch(() => ({}))` para parseos seguros, asumiendo un objeto vacío en el peor de los casos y recayendo en un mensaje de error genérico.
- **Cambios no notificados de backend**: El backend está advertido de que los parches (500 de Auth y 404 del DELETE) son workarounds frágiles y deben mejorarse. Si los corrigen de improviso, nuestra función caerá al caso "default" o al HTTP code nuevo (401/409).
