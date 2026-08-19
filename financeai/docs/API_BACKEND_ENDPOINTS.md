# Documentacion de Endpoints - Backend Finanzas

## Informacion base

- **Base URL local:** `http://localhost:8080`
- **Prefijo API:** `/api/v1`
- **Autenticacion actual:** no se requiere token para `/api/v1/auth/**` ni `/api/v1/finanzas/**`
- **Content-Type esperado:** `application/json`
- **CORS:** permitido para cualquier origen (`*`)

---

## 1) Auth

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

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `nombre` | string | Si | No vacio |
| `email` | string | Si | No vacio + formato email |
| `password` | string | Si | No vacio + minimo 6 caracteres |

**Respuesta 200**

```json
{
  "mensaje": "Usuario registrado exitosamente",
  "status": "success"
}
```

**Errores**

- `400` validaciones DTO
- `500` error interno (ej. email duplicado si se lanza `RuntimeException`)

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

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `email` | string | Si | No vacio + formato email |
| `password` | string | Si | No vacio |

**Respuesta 200**

```json
{
  "mensaje": "Bienvenido de nuevo, Ana",
  "email": "ana@email.com",
  "id": 1,
  "token": "fake-jwt-token-for-session",
  "status": "success"
}
```

> `id` y `token` son valores simulados en la implementacion actual.

---

### `DELETE /api/v1/auth/eliminar?email={email}`

Elimina cuenta por email.

| Parametro | Tipo | Requerido |
|---|---|---|
| `email` | string | Si |

**Respuesta 200**

```json
{
  "mensaje": "Cuenta eliminada correctamente"
}
```

**Respuesta 404**

```json
{
  "error": "Usuario no encontrado"
}
```

---

## 2) Finanzas

### `POST /api/v1/finanzas/analizar`

Genera analisis financiero y guarda historial.

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

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `ingreso_mensual` | number (double) | Si | `> 0` |
| `nivel_endeudamiento` | integer | Si | No nulo |
| `frecuencia_ahorro` | string | Si | No nulo |
| `monto_inversion` | number (double) | Si | `>= 0` |
| `deuda_total` | number (double) | Si | `>= 0` |
| `objetivo_presupuesto` | number (double) | Si | `>= 0` |
| `pago_mensual_deuda` | number (double) | Si | `>= 0` |
| `servicios_suscripción` | integer | Si | `>= 0` |
| `fondo_emergencia` | number (double) | Si | `>= 0` |
| `transacciones` | array | Si | No vacia (validacion en servicio) |

`transacciones[]`

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `descripcion` | string | Si | No vacio |
| `valor` | number (double) | Si | `> 0` |
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

- Si falla el microservicio Python, el backend devuelve fallback con `200`.
- Este endpoint ya **no** recibe `usuarioId`; guarda el analisis en el primer usuario encontrado en BD.

---

### `POST /api/v1/finanzas/clasificar`

Clasifica una transaccion individual.

**Body JSON**

```json
{
  "descripcion": "Netflix",
  "valor": 15.99,
  "fecha_transaccion": "2026-08-17T20:30:00.000Z"
}
```

| Campo | Tipo | Requerido | Validacion |
|---|---|---|---|
| `descripcion` | string | Si | No vacio |
| `valor` | number (double) | Si | `> 0` |
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

---

### `GET /api/v1/finanzas/historial/{usuarioId}`

Obtiene historial por ID de usuario.

| Parametro | Tipo | Requerido |
|---|---|---|
| `usuarioId` | number (long) | Si |

**Respuesta 200**

```json
[
  {
    "id": 10,
    "perfilFinanciero": "Estable",
    "fechaAnalisis": "2026-08-17 20:31:10",
    "transacciones": [],
    "categorias": [],
    "recomendaciones": []
  }
]
```

---

### `GET /api/v1/finanzas/historial`

Obtiene historial del primer usuario encontrado en BD.

**Respuesta 200**

```json
[
  {
    "id": 10,
    "perfilFinanciero": "Estable",
    "fechaAnalisis": "2026-08-17 20:31:10",
    "transacciones": [],
    "categorias": [],
    "recomendaciones": []
  }
]
```

Si no hay usuarios registrados, responde lista vacia `[]`.

---

## Formato de errores vigente (GlobalExceptionHandler)

El backend ahora si tiene manejador global:

- `400` (`ErrorResponseDTO`) para validaciones DTO
- `404` (`ErrorResponseDTO`) para `ResourceNotFoundException`
- `409` (`DataErrorResponseDTO`) para duplicados/integridad
- `415` (`ErrorResponseDTO`) para `Content-Type` no soportado
- `500` (`ErrorResponseDTO`) para errores no controlados

Ejemplo `ErrorResponseDTO`:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validacion en los datos enviados.",
  "validation_errors": {
    "ingresoMensual": "El ingreso mensual es obligatorio"
  },
  "timestamp": "2026-08-19T11:00:00"
}
```

