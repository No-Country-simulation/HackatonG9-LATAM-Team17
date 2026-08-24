# Documentación de Excepciones del Backend

Este documento describe todas las excepciones que el backend (Spring Boot) puede emitir, sus códigos HTTP, el formato JSON de respuesta y cómo debe tratarlas el frontend.

Todas las excepciones son capturadas de forma centralizada en:
`saludfinanciera.finanzas.exception.GlobalExceptionHandler`

---

## Índice de errores

| # | Excepción | HTTP Status | Endpoint(s) donde puede ocurrir | DTO de respuesta |
|---|-----------|-------------|----------------------------------|-------------------|
| 1 | `ResourceNotFoundException` | 404 Not Found | `POST /analizar`, `POST /clasificar`, `PUT /auth/usuarios/{id}` | `ErrorResponseDTO` |
| 2 | `DataIntegrityViolationException` | 409 Conflict | `DELETE /eliminar`, cualquier operación de guardado/borrado en BD | `DataErrorResponseDTO` |
| 3 | `EntityAlreadyExistsException` | 409 Conflict | `POST /registro` (email ya registrado), `PUT /auth/usuarios/{id}` (email en uso por otro usuario) | `DataErrorResponseDTO` |
| 3.1 | `AuthenticationFailedException` | 401 Unauthorized | `POST /login` (usuario inexistente o contraseña incorrecta) | `ErrorResponseDTO` |
| 4 | `MethodArgumentNotValidException` | 400 Bad Request | Todos los endpoints con `@Valid @RequestBody` (`/registro`, `/login`, `/analizar`, `/clasificar`, `PUT /auth/usuarios/{id}`) | `ErrorResponseDTO` (con `validation_errors`) |
| 5 | `HttpStatusCodeException` | 502 Bad Gateway | `POST /analizar`, `POST /clasificar` (cuando el microservicio Python responde 4xx/5xx) | `PythonServiceErrorDTO` |
| 6 | `ResourceAccessException` | 503 Service Unavailable | `POST /analizar`, `POST /clasificar` (cuando el microservicio Python no responde/está caído) | `PythonServiceErrorDTO` |
| 7 | `Exception` (genérica, catch-all) | 500 Internal Server Error | Cualquier endpoint | `ErrorResponseDTO` |
| 8 | `HttpMediaTypeNotSupportedException` | 415 Unsupported Media Type | Cualquier endpoint que reciba `Content-Type` inválido | `ErrorResponseDTO` |

> ✅ **Actualización (2026-08-20):** se corrigió el gap descrito anteriormente en `AuthService`. Ver sección **"7. Historial de cambios"** al final de este documento para el detalle completo de qué se modificó y por qué.

---

## 1. Estructuras de respuesta (DTOs)

### `ErrorResponseDTO`
Usado para errores generales y de validación.

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación en los datos enviados.",
  "validation_errors": {
    "email": "El email debe ser válido",
    "password": "La contraseña es obligatoria"
  },
  "timestamp": "2026-08-20T11:00:00"
}
```

- `validation_errors` es un objeto vacío `{}` cuando el error no proviene de validación de campos (ej. 404, 401 o 500) — los handlers pasan `Map.of()`, no `null`.

### `DataErrorResponseDTO`
Usado para conflictos de base de datos (integridad, duplicados).

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Error al procesar la información en la base de datos.",
  "detail": "Asegúrate de que los datos obligatorios estén presentes y no haya registros duplicados.",
  "timestamp": "2026-08-20T11:00:00"
}
```

### `PythonServiceErrorDTO`
Usado exclusivamente para errores de comunicación con el microservicio de Python (Data Science / NLP).

```json
{
  "status": 502,
  "error": "Bad Gateway",
  "message": "El servicio de procesamiento financiero (Python) no pudo completar la solicitud.",
  "python_service_detail": "Detalle del servicio aguas abajo: 500 - Internal Server Error",
  "timestamp": "2026-08-20T11:00:00"
}
```

---

## 2. Detalle por excepción

### 1) `ResourceNotFoundException` → 404
**Cuándo ocurre:**
- `POST /api/v1/finanzas/analizar`: cuando `transacciones` viene vacío/nulo, o la respuesta del motor Python es nula.
- `POST /api/v1/finanzas/clasificar`: cuando el DTO de transacción es nulo, o no se obtiene respuesta de clasificación.
- `PUT /api/v1/auth/usuarios/{id}`: cuando no existe un usuario con el `id` indicado.

**Tratamiento en frontend:**
- Mostrar mensaje del campo `message` directamente al usuario (son mensajes ya amigables en español).
- No reintentar automáticamente; el usuario debe corregir los datos de entrada.

---

### 2) `DataIntegrityViolationException` → 409
**Cuándo ocurre:**
- Al registrar un usuario con datos que violan una restricción de BD (ej. columna `nullable=false` vacía a nivel de BD, aunque ya pasó Bean Validation).
- **Al eliminar una cuenta (`DELETE /api/v1/auth/eliminar`) cuando el usuario tiene registros relacionados** (ej. `AnalisisFinanciero` asociados) — la FK `usuario_id` bloquea el `DELETE`.
- Cualquier violación de restricción única (`unique`) no capturada antes por validación de negocio.

**Tratamiento en frontend:**
- El `message` es genérico ("Error al procesar la información en la base de datos"); usar `detail` para dar más contexto si se muestra a un usuario técnico, pero para usuario final se recomienda mapear a un mensaje propio, por ejemplo:
  - En `/eliminar`: *"No se puede eliminar la cuenta porque tiene historial de análisis asociado."*
  - En `/registro`: *"No se pudo completar el registro, verifica los datos ingresados."*
- Status 409 → no reintentar automáticamente, requiere acción del usuario o del backend (ej. borrado en cascada).

---

### 3) `EntityAlreadyExistsException` → 409
**Cuándo ocurre:**
- `POST /api/v1/auth/registro` cuando el email ya está registrado en la base de datos (`usuarioRepository.existsByEmail`).
- `PUT /api/v1/auth/usuarios/{id}` cuando el `email` enviado ya está en uso por **otro** usuario distinto al que se edita (`usuarioRepository.existsByEmailAndIdNot`).

> ✅ Antes del 2026-08-20 esto lanzaba `RuntimeException` genérica (500). Ahora usa esta excepción custom ya existente en el proyecto, devolviendo el status correcto (409).

**Tratamiento en frontend:**
- Usar `message`/`detail` para informar: *"Este correo ya está registrado, intenta iniciar sesión."*
- Status 409 → no reintentar automáticamente, el usuario debe usar otro email o ir a login.

---

### 3.1) `AuthenticationFailedException` → 401 *(NUEVA)*
**Cuándo ocurre:**
- `POST /api/v1/auth/login`:
  - El email no existe en la base de datos.
  - El email existe pero la contraseña no coincide con el hash almacenado.
- En ambos casos se usa el **mismo mensaje** (`"Usuario o contraseña incorrectos."`) por buena práctica de seguridad: no revelar si el email existe o no.

**Respuesta:**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Usuario o contraseña incorrectos.",
  "validation_errors": {},
  "timestamp": "2026-08-20T14:37:00"
}
```

**Tratamiento en frontend:**
- Status 401 → mostrar mensaje de credenciales inválidas en el formulario de login.
- No reintentar automáticamente. No redirigir a "sesión expirada" (eso normalmente es 401 en rutas protegidas con token, aquí es 401 de credenciales de login — distinguir por el endpoint de origen, no solo por el status).

---

### 4) `MethodArgumentNotValidException` → 400
**Cuándo ocurre:**
- Falla alguna anotación de Bean Validation (`@NotNull`, `@Email`, `@Size`, etc.) en los DTOs de request: `RegistroRequestDTO`, `LoginRequestDTO`, `AnalisisInputDTO`, `TransaccionDTO`, `ActualizarUsuarioRequestDTO`.
- `PUT /api/v1/auth/usuarios/{id}` con body vacío `{}` o ambos campos nulos/vacíos (validador de clase `@AlMenosUnCampoPresente`).

**Tratamiento en frontend:**
- Usar el mapa `validation_errors` (`{campo: mensaje}`) para resaltar el campo específico del formulario con su mensaje de error.
- No usar solo `message` genérico para UX de formularios; iterar `validation_errors`.

```js
if (error.validation_errors) {
  Object.entries(error.validation_errors).forEach(([campo, msg]) => {
    mostrarErrorEnCampo(campo, msg);
  });
}
```

---

### 5) `HttpStatusCodeException` → 502
**Cuándo ocurre:**
- El microservicio de Python (Data Science) respondió pero con un status 4xx/5xx (ej. error interno del modelo, payload inválido para el modelo, etc.).
- Aplica a `/analizar` y `/clasificar`.

**Tratamiento en frontend:**
- Mostrar mensaje: *"El servicio de análisis no está disponible temporalmente, intenta de nuevo más tarde."*
- Es razonable ofrecer botón de "Reintentar" ya que puede ser un fallo transitorio del servicio Python.
- `python_service_detail` es útil solo para logs/debug, no para el usuario final.

---

### 6) `ResourceAccessException` → 503
**Cuándo ocurre:**
- El microservicio Python está caído, inalcanzable o no responde dentro del timeout configurado.
- Aplica a `/analizar` y `/clasificar`.

**Tratamiento en frontend:**
- Igual que el caso anterior: status 503 sugiere reintento posterior (backoff). Mostrar mensaje de "servicio no disponible" y permitir reintento manual.

---

### 7) `Exception` genérica (catch-all) → 500
**Cuándo ocurre:**
- Cualquier error no anticipado: `NullPointerException`, errores de configuración, errores no mapeados de bibliotecas externas, etc.
- `POST /api/v1/finanzas/analizar` cuando **no hay ningún usuario registrado** en la base de datos — `AnalisisService` lanza una `RuntimeException` genérica (`"No hay usuarios registrados en el sistema."`) que cae en este handler.

**Tratamiento en frontend:**
- Mensaje genérico: *"Ocurrió un error inesperado, intenta de nuevo."*
- No hay `validation_errors` ni detalle específico — no se debe intentar extraer información adicional del campo `message`, salvo los casos especiales documentados abajo.

---

### 8) `HttpMediaTypeNotSupportedException` → 415
**Cuándo ocurre:**
- El request no envía `Content-Type: application/json` (ej. el frontend envía `multipart/form-data` o no define el header).

**Tratamiento en frontend:**
- Es un error de integración/configuración, no de datos del usuario. Verificar que todos los `fetch`/`axios` usados por el frontend seteen explícitamente `Content-Type: application/json`.

---

## 3. Casos especiales — `AuthService` (login / registro) — RESUELTO

> Esta sección documentaba un problema que **ya fue corregido el 2026-08-20**. Se deja constancia histórica para referencia.

**Antes:** `AuthService` lanzaba `RuntimeException` genéricas para "email duplicado" y "credenciales inválidas", las cuales caían en el handler catch-all (`Exception.class` → 500 Internal Server Error), impidiendo que el frontend distinguiera un error de negocio de un fallo real de servidor.

**Ahora:**
- Email duplicado en registro → `EntityAlreadyExistsException` → **409 Conflict**.
- Login con usuario inexistente o contraseña incorrecta → `AuthenticationFailedException` (nueva) → **401 Unauthorized**.

El workaround de "matching de texto sobre `message`" ya **no es necesario** en el frontend; ahora se puede confiar en el código HTTP:

```js
if (response.status === 409) {
  mostrarError('Este correo ya está registrado.');
} else if (response.status === 401) {
  mostrarError('Credenciales inválidas.');
} else {
  mostrarError('Ocurrió un error inesperado.');
}
```

---

## 4. Endpoints y excepciones asociadas (resumen rápido)

| Endpoint | Método | Excepciones posibles |
|----------|--------|------------------------|
| `/api/v1/auth/registro` | POST | 400 (validación), 409 (`EntityAlreadyExistsException` — email duplicado), 409 (`DataIntegrityViolationException`), 415 |
| `/api/v1/auth/login` | POST | 400 (validación), 401 (`AuthenticationFailedException` — credenciales inválidas), 415 |
| `/api/v1/auth/eliminar` | DELETE | 404 (no manejado explícitamente, ver nota), 409 (`DataIntegrityViolationException` por FK con `AnalisisFinanciero`) |
| `/api/v1/auth/usuarios/{id}` | PUT | 400 (validación / `@AlMenosUnCampoPresente`), 404 (`ResourceNotFoundException` — usuario no existe), 409 (`EntityAlreadyExistsException` — email en uso por otro usuario), 415 |
| `/api/v1/finanzas/analizar` | POST | 400 (validación), 404 (`ResourceNotFoundException`), 500 (sin usuarios registrados en BD), 502, 503, 415 |
| `/api/v1/finanzas/clasificar` | POST | 400 (validación), 404 (`ResourceNotFoundException`), 502, 503, 415 |
| `/api/v1/finanzas/historial` | GET | 500 (genérico, sin manejo específico) |
| `/api/v1/finanzas/historial/{usuarioId}` | GET | 500 (genérico, sin manejo específico) |

> **Nota sobre `/eliminar`:** cuando el usuario no existe, `AuthController.eliminarCuenta` devuelve `404` con un JSON simple `{"error": "Usuario no encontrado"}` construido manualmente en el controller — **este NO usa `ErrorResponseDTO`**, es una estructura distinta al resto de errores 404. El frontend debe manejarlo como un caso aparte (`error.error` en vez de `error.message`).

---

## 5. Recomendación general de manejo en frontend

```js
async function manejarRespuestaError(response) {
  const body = await response.json().catch(() => ({}));

  switch (response.status) {
    case 400:
      return body.validation_errors ?? { general: body.message };
    case 404:
      // Ojo: /auth/eliminar usa "error", el resto usa "message"
      return { general: body.message ?? body.error ?? 'Recurso no encontrado.' };
    case 409:
      return { general: body.detail ?? body.message ?? 'Conflicto con los datos existentes.' };
    case 415:
      return { general: 'Formato de solicitud no soportado.' };
    case 502:
    case 503:
      return { general: 'El servicio de análisis no está disponible, intenta más tarde.', retryable: true };
    case 500:
    default:
      return { general: body.message ?? 'Ocurrió un error inesperado.' };
  }
}
```

---

## 6. Gaps detectados (para seguimiento con backend)

1. ~~`AuthService` no usa excepciones custom~~ → **Resuelto el 2026-08-20** (ver sección 7).
2. ~~`EntityAlreadyExistsException` está implementada pero sin uso real en el código~~ → **Resuelto el 2026-08-20**, ahora se usa en `registrarUsuario`.
3. `/auth/eliminar` no lanza `ResourceNotFoundException` para "usuario no encontrado"; construye el 404 manualmente en el controller con una estructura JSON distinta (`{"error": ...}`) al resto de respuestas de error (`ErrorResponseDTO` usa `message`). **(Pendiente)**
4. No existe actualmente un manejo explícito para `DELETE /eliminar` cuando falla por FK con `AnalisisFinanciero` — cae en el handler genérico de `DataIntegrityViolationException` (409), sin mensaje específico de "el usuario tiene historial asociado". **(Pendiente)**

---

## 7. Historial de cambios

### 2026-08-20 — Corrección de excepciones en autenticación

**Problema detectado:** al autenticarse con un usuario inexistente, o al registrar un usuario con email duplicado, `AuthService` lanzaba `RuntimeException` genéricas. Como no había un `@ExceptionHandler` específico para `RuntimeException`, estos casos caían en el handler catch-all (`Exception.class`), devolviendo **500 Internal Server Error** en vez de un código semántico. Esto impedía que el frontend distinguiera errores de negocio (credenciales inválidas, email duplicado) de fallos reales del servidor.

**Cambios aplicados:**

1. **Nueva excepción `AuthenticationFailedException`** (`exception/AuthenticationFailedException.java`): extiende `RuntimeException`, siguiendo el mismo patrón que `ResourceNotFoundException` y `EntityAlreadyExistsException` ya existentes en el proyecto.

2. **`AuthService.autenticarUsuario`**: se reemplazaron los dos `throw new RuntimeException("Usuario o contraseña incorrectos.")` (uno para email inexistente, otro para password incorrecta) por `throw new AuthenticationFailedException(...)`, manteniendo el mismo mensaje en ambos casos para no revelar si el email existe (buena práctica de seguridad).

3. **`AuthService.registrarUsuario`**: se reemplazó `throw new RuntimeException("El correo electrónico ya está en uso.")` por `throw new EntityAlreadyExistsException(...)`, reutilizando una excepción que ya existía en el proyecto pero que no se usaba en ningún lado.

4. **`GlobalExceptionHandler`**: se agregó un nuevo handler `handleAuthenticationFailed` para `AuthenticationFailedException`, devolviendo **401 Unauthorized** con `ErrorResponseDTO`. No fue necesario agregar handler para `EntityAlreadyExistsException` porque ya existía (handler #3, 409 Conflict) — solo estaba huérfano de uso real.

**Por qué se hizo así:**
- Se reutilizó `EntityAlreadyExistsException` en vez de crear una nueva, porque ya cumplía exactamente el propósito y ya tenía handler.
- Se creó `AuthenticationFailedException` en vez de reutilizar `ResourceNotFoundException`, porque semánticamente "credenciales inválidas" no es un 404 (no se trata de que el usuario no se buscó bien, sino de un fallo de autenticación), y HTTP 401 es el código estándar para este caso.
- Se mantuvo el mismo mensaje para "usuario no existe" y "password incorrecta" para no dar pistas a un atacante sobre qué emails están registrados (previene enumeración de usuarios).

**Impacto para el frontend:**
- `POST /login` con credenciales inválidas ahora responde **401** en vez de 500.
- `POST /registro` con email duplicado ahora responde **409** en vez de 500.
- El workaround de "matching de texto sobre `message`" documentado previamente ya no es necesario; ver sección 3 actualizada.
- **Breaking change de contrato**: si el frontend actual tiene lógica que asume 500 para estos casos, debe actualizarse para verificar 401/409 en su lugar.

**Verificación realizada:** se ejecutó `mvn compile` tras los cambios, compilación exitosa sin errores.
