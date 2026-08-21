# Documentación de Endpoints - Backend Finanzas

**Última actualización:** 2026-08-21 — refleja el estado real del código verificado en esta fecha (paginación de historial, login con `nombre`/`id` reales, endpoint de actualización de perfil, y manejo de errores vigente incluyendo `401` de autenticación).

## Información base

- **Base URL local:** `http://localhost:8080`
- **Prefijo API:** `/api/v1`
- **Autenticación actual:** no se requiere token para `/api/v1/auth/**` ni `/api/v1/finanzas/**` (`permitAll()` en `SecurityConfig`). El `token` que devuelve el login es un valor **simulado**, no se valida en ninguna request posterior.
- **Content-Type esperado:** `application/json` (enviar explícitamente el header; ver nota en sección de errores sobre `415`).
- **CORS:** permitido para cualquier origen (`*`).
- **Documentación interactiva:** Swagger UI disponible en `/swagger-ui.html`, spec OpenAPI en `/v3/api-docs`.

---

## 1) Auth (`/api/v1/auth`)

### `POST /api/v1/auth/registro`

Registra un nuevo usuario.

**Body JSON**

```json
{
  "nombre": "Ana Perez",
  "email": "ana@email.com",
  "password": "123456"
}
```

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `nombre` | string | Sí | No vacío |
| `email` | string | Sí | No vacío + formato email |
| `password` | string | Sí | No vacío + mínimo 6 caracteres |

**Respuesta 200**

```json
{
  "mensaje": "Usuario registrado exitosamente",
  "status": "success"
}
```

**Errores**

- `400` — validaciones de campos (`ErrorResponseDTO`, con `validation_errors`).
- `409` — email ya registrado (`EntityAlreadyExistsException` → `DataErrorResponseDTO`).

---

### `POST /api/v1/auth/login`

Autentica por email/password.

**Body JSON**

```json
{
  "email": "ana@email.com",
  "password": "123456"
}
```

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `email` | string | Sí | No vacío + formato email |
| `password` | string | Sí | No vacío |

**Respuesta 200**

```json
{
  "mensaje": "Bienvenido de nuevo, Ana Perez",
  "nombre": "Ana Perez",
  "email": "ana@email.com",
  "id": 15,
  "token": "fake-jwt-token-for-session",
  "status": "success"
}
```

> **`id` ahora es el ID real del usuario autenticado** (`usuario.getId()`) — corregido el 2026-08-21, antes estaba hardcodeado a `1`. **`token` sigue siendo un valor simulado**, no es un JWT real.

**Errores**

- `400` — validaciones de campos.
- `401` — credenciales inválidas: usuario inexistente o contraseña incorrecta (`AuthenticationFailedException` → `ErrorResponseDTO`). Se usa el mismo mensaje genérico para ambos casos por seguridad (no revela si el email existe).

---

### `DELETE /api/v1/auth/eliminar?email={email}`

Elimina cuenta por email.

| Parámetro | Tipo | Requerido |
|---|---|---|
| `email` | string (query param) | Sí |

**Respuesta 200**

```json
{
  "mensaje": "Cuenta eliminada correctamente"
}
```

**Respuesta 404** (formato manual, **distinto** al resto de errores 404 del proyecto — usa `error` en vez de `message`)

```json
{
  "error": "Usuario no encontrado"
}
```

**Respuesta 409** — si el usuario tiene registros relacionados (ej. `AnalisisFinanciero` asociados), la eliminación falla por restricción de clave foránea (`DataIntegrityViolationException` → `DataErrorResponseDTO`). No existe actualmente borrado en cascada.

---

### `PUT /api/v1/auth/usuarios/{id}` — **Nuevo (2026-08-21)**

Actualiza el nombre y/o el email de un usuario. **Soporta actualización parcial**: se puede enviar solo `nombre`, solo `email`, o ambos en la misma solicitud.

| Parámetro | Tipo | Requerido |
|---|---|---|
| `id` | number (long, path param) | Sí |

**Body JSON — ejemplos válidos**

```json
{ "nombre": "Ana Perez Editada" }
```
```json
{ "email": "ana.nueva@email.com" }
```
```json
{ "nombre": "Ana Perez Editada", "email": "ana.nueva@email.com" }
```

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `nombre` | string | No (pero ver regla abajo) | Si viene presente, no puede estar vacío |
| `email` | string | No (pero ver regla abajo) | Si viene presente, debe tener formato de email válido |

> **Regla de negocio:** al menos uno de los dos campos debe venir presente (no vacío/no nulo). Un body vacío `{}` o con ambos campos nulos/vacíos es rechazado con `400`.

**Respuesta 200**

```json
{
  "mensaje": "Perfil actualizado correctamente",
  "id": 15,
  "nombre": "Ana Perez Editada",
  "email": "ana.nueva@email.com",
  "status": "success"
}
```

**Errores**

- `400` — body vacío o ambos campos ausentes (validador `@AlMenosUnCampoPresente`), o `email` con formato inválido.
- `404` — no existe un usuario con ese `id` (`ResourceNotFoundException`).
- `409` — el `email` enviado ya está en uso por **otro** usuario distinto al que se está editando (`EntityAlreadyExistsException`).

---

## 2) Finanzas (`/api/v1/finanzas`)

### `POST /api/v1/finanzas/analizar`

Genera análisis financiero y guarda historial.

**Body JSON**

```json
{
  "ingreso_mensual": 4500.0,
  "nivel_endeudamiento": 35,
  "frecuencia_ahorro": "mensual",
  "monto_inversion": 300.0,
  "deuda_total": 1800.0,
  "objetivo_presupuesto": 2500.0,
  "pago_mensual_deuda": 200.0,
  "servicios_suscripción": 3,
  "fondo_emergencia": 1200.0,
  "transacciones": [
    {
      "descripcion": "Supermercado",
      "valor": 120.5,
      "fecha_transaccion": "2026-08-17T20:30:00.000Z"
    }
  ]
}
```

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `ingreso_mensual` | number (double) | Sí | `> 0` |
| `nivel_endeudamiento` | integer | Sí | No nulo |
| `frecuencia_ahorro` | string | Sí | No nulo |
| `monto_inversion` | number (double) | Sí | `>= 0` |
| `deuda_total` | number (double) | Sí | `>= 0` |
| `objetivo_presupuesto` | number (double) | Sí | `>= 0` |
| `pago_mensual_deuda` | number (double) | Sí | `>= 0` |
| `servicios_suscripción` | integer | Sí | `>= 0` |
| `fondo_emergencia` | number (double) | Sí | `>= 0` |
| `transacciones` | array | Sí | No vacía (validación en servicio) |

`transacciones[]`

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `descripcion` | string | Sí | No vacío |
| `valor` | number (double) | Sí | `> 0` |
| `fecha_transaccion` | string datetime ISO-8601 | No | acepta formato con o sin milisegundos y `Z` |

**Respuesta 200 (`AnalisisOutputDTO`)**

```json
{
  "perfil_financiero": "Estable",
  "probabilidad": 0.78,
  "resumen_gastos": {
    "Alimentacion": 420.0,
    "Transporte": 180.0
  },
  "recomendaciones": [
    "Reduce gastos variables",
    "Aumenta tu fondo de emergencia"
  ]
}
```

**Notas de comportamiento**

- Este endpoint **no** recibe `usuarioId`; guarda el análisis asociado al primer usuario encontrado en la base de datos (`usuarioRepository.findAll().stream().findFirst()`). No es un análisis "por usuario logueado" real todavía.
- Ninguno de los campos financieros del input (`ingreso_mensual`, `deuda_total`, `frecuencia_ahorro`, `nivel_endeudamiento`, etc.) se persiste de forma independiente — solo se guardan `perfilFinanciero`, `transacciones`, `categorias` y `recomendaciones` en `AnalisisFinanciero`.

**Errores**

- `400` — validaciones de campos.
- `404` — transacciones vacías/nulas, o respuesta nula del motor Python (`ResourceNotFoundException`).
- `502` — el microservicio Python respondió con error (`HttpStatusCodeException`).
- `503` — el microservicio Python no responde/está caído (`ResourceAccessException`).

---

### `POST /api/v1/finanzas/clasificar`

Clasifica una transacción individual.

**Body JSON**

```json
{
  "descripcion": "Netflix",
  "valor": 15.99,
  "fecha_transaccion": "2026-08-17T20:30:00.000Z"
}
```

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `descripcion` | string | Sí | No vacío |
| `valor` | number (double) | Sí | `> 0` |
| `fecha_transaccion` | string datetime ISO-8601 | No | acepta formato con o sin milisegundos y `Z` |

**Respuesta 200 (`RespuestaPythonDTO`)**

```json
{
  "probabilidad_categoria": 0.85,
  "probabilidad_perfil_financiero": 0.73,
  "probabilidad_recomendaciones": 0.69,
  "perfil_financiero": "Estable",
  "resumen_gastos": {
    "Ocio": 15.99
  },
  "recomendaciones": [
    "Controla gastos recurrentes en entretenimiento"
  ]
}
```

**Errores:** mismos códigos que `/analizar` (400, 404, 502, 503).

---

### `GET /api/v1/finanzas/historial/{usuarioId}` — **Paginado (actualizado 2026-08-19)**

Obtiene el historial de análisis de un usuario específico, **paginado**.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `usuarioId` | number (long, path param) | Sí | ID del usuario |
| `page` | integer (query param) | No | Número de página, base 0. Default: `0` |
| `size` | integer (query param) | No | Tamaño de página. Default: `10`. **Máximo permitido: `100`** (valores mayores se recortan automáticamente) |
| `sort` | string (query param) | No | Campo y dirección de orden, ej. `sort=fechaAnalisis,asc`. Default: `fechaAnalisis,desc` |

**Respuesta 200 (`Page<AnalisisFinanciero>`)**

```json
{
  "content": [
    {
      "id": 10,
      "perfilFinanciero": "Estable",
      "fechaAnalisis": "2026-08-17 20:31:10",
      "transacciones": [],
      "categorias": [],
      "recomendaciones": []
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10, "sort": { "sorted": true }, "offset": 0 },
  "totalElements": 12,
  "totalPages": 2,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false,
  "numberOfElements": 10,
  "empty": false
}
```

> ⚠️ **Breaking change respecto a versiones anteriores:** este endpoint devolvía una `List<AnalisisFinanciero>` plana; ahora devuelve un objeto `Page` con metadata de paginación. El frontend debe leer `response.content` para obtener el arreglo de análisis.

---

### `GET /api/v1/finanzas/historial` — **Paginado (actualizado 2026-08-19)**

Obtiene el historial paginado del primer usuario encontrado en la base de datos (mismo mecanismo de "usuario activo" simulado que `/analizar`).

Mismos parámetros de paginación (`page`, `size`, `sort`) y mismo formato de respuesta `Page<AnalisisFinanciero>` que el endpoint anterior.

Si no hay usuarios registrados, responde una página vacía (`Page.empty()`: `"content": [], "totalElements": 0, "empty": true`) en vez de una lista vacía `[]`.

---

## Formato de errores vigente (`GlobalExceptionHandler`)

| Status | Excepción | DTO de respuesta | Cuándo ocurre |
|---|---|---|---|
| `400` | `MethodArgumentNotValidException` | `ErrorResponseDTO` (con `validation_errors`) | Falla `@Valid` en cualquier DTO de entrada |
| `401` | `AuthenticationFailedException` | `ErrorResponseDTO` | Login con usuario inexistente o password incorrecta |
| `404` | `ResourceNotFoundException` | `ErrorResponseDTO` | Recurso no encontrado (usuario, análisis, transacciones vacías, etc.) |
| `409` | `DataIntegrityViolationException` | `DataErrorResponseDTO` | Violación de restricción de BD (ej. FK al eliminar usuario con historial) |
| `409` | `EntityAlreadyExistsException` | `DataErrorResponseDTO` | Email duplicado (registro o actualización de perfil) |
| `415` | `HttpMediaTypeNotSupportedException` | `ErrorResponseDTO` | `Content-Type` no es `application/json` |
| `500` | `Exception` (catch-all) | `ErrorResponseDTO` | Cualquier error no controlado |
| `502` | `HttpStatusCodeException` | `PythonServiceErrorDTO` | El microservicio Python respondió con error |
| `503` | `ResourceAccessException` | `PythonServiceErrorDTO` | El microservicio Python no responde/está caído |

Ejemplo `ErrorResponseDTO` (400 con validación):

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación en los datos enviados.",
  "validation_errors": {
    "ingresoMensual": "El ingreso mensual es obligatorio"
  },
  "timestamp": "2026-08-21T11:00:00"
}
```

Ejemplo `ErrorResponseDTO` (401 login inválido):

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Usuario o contraseña incorrectos.",
  "validation_errors": {},
  "timestamp": "2026-08-21T11:00:00"
}
```

> Para el detalle completo de cada excepción, ejemplos adicionales y recomendaciones de manejo en frontend, ver `docs/EXCEPCIONES_BACKEND.md`.

---

## Deuda técnica conocida (sin resolver a la fecha)

1. `"token": "fake-jwt-token-for-session"` en el login sigue siendo un valor simulado, no un JWT real — no hay validación de sesión/expiración.
2. `/analizar`, `/clasificar` y `/historial` no usan un "usuario autenticado" real — operan sobre el primer usuario encontrado en la BD (`findAll().stream().findFirst()`), no sobre el usuario del token/sesión.
3. `DELETE /auth/eliminar` no tiene borrado en cascada — falla con `409` si el usuario tiene historial asociado, sin mensaje específico para ese caso.
4. No existe endpoint para actualizar parámetros financieros base (`ingreso_mensual`, `deuda_total`, `frecuencia_ahorro`) de forma independiente a un análisis completo — diseño documentado en `docs/PLAN_ENDPOINTS_PERFIL_PARAMETROS.md` (Endpoint 2), aún no implementado.

