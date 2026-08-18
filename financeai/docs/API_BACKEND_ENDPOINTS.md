# Documentación de Endpoints - Backend Finanzas

## Información base

- **Base URL local:** `http://localhost:8080`
- **Prefijo API:** `/api/v1`
- **Autenticación actual:** no se requiere token (rutas `/api/v1/auth/**` y `/api/v1/finanzas/**` públicas).
- **Content-Type esperado en requests con body:** `application/json`
- **CORS:** permitido para cualquier origen (`*`).

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

**Campos**

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `nombre` | string | Sí | No vacío |
| `email` | string | Sí | No vacío + formato email |
| `password` | string | Sí | No vacío + mínimo 6 caracteres |

**Respuesta 200**

```text
Usuario registrado exitosamente
```

**Errores frecuentes**

- `400`: body inválido por validación.
- `500`: email ya registrado (actualmente se lanza `RuntimeException`).

---

### `POST /api/v1/auth/login`

Autentica usuario por email/password.

**Body JSON**

```json
{
  "email": "ana@email.com",
  "password": "123456"
}
```

**Campos**

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `email` | string | Sí | No vacío + formato email |
| `password` | string | Sí | No vacío |

**Respuesta 200**

```json
{
  "mensaje": "Bienvenido de nuevo, Ana",
  "id": 1,
  "email": "ana@email.com"
}
```

**Errores frecuentes**

- `400`: body inválido por validación.
- `500`: credenciales incorrectas (actualmente se lanza `RuntimeException`).

---

### `DELETE /api/v1/auth/eliminar?email={email}`

Elimina cuenta por email.

**Query params**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `email` | string | Sí | Email del usuario a eliminar |

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

### `POST /api/v1/finanzas/analizar?usuarioId={id}`

Genera análisis financiero, guarda historial y devuelve resultado para frontend.

**Query params**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `usuarioId` | number (long) | Sí | ID del usuario dueño del análisis |

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
      "fecha_transaccion": "2026-08-17T20:30:00"
    }
  ]
}
```

**Campos de body**

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `ingreso_mensual` | number (double) | Sí | `> 0` |
| `nivel_endeudamiento` | integer | No | Sin validación adicional |
| `frecuencia_ahorro` | string | Sí | No nulo |
| `monto_inversion` | number (double) | Sí | `>= 0` |
| `deuda_total` | number (double) | Sí | `>= 0` |
| `objetivo_presupuesto` | number (double) | Sí | `>= 0` |
| `pago_mensual_deuda` | number (double) | Sí | `>= 0` |
| `servicios_suscripción` | integer | Sí | `>= 0` |
| `fondo_emergencia` | number (double) | Sí | `>= 0` |
| `transacciones` | array | No | Lista de transacciones |

**Objeto `transacciones[]`**

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `descripcion` | string | Sí | No vacío |
| `valor` | number (double) | Sí | `> 0` |
| `fecha_transaccion` | string datetime ISO-8601 | No | Si no se envía, backend usa fecha/hora actual |

**Respuesta 200 (`AnalisisOutputDTO`)**

```json
{
  "perfil_financiero": "Estable",
  "probabilidad": 0.78,
  "resumen_gastos": {
    "Alimentación": 420.0,
    "Transporte": 180.0
  },
  "recomendaciones": [
    "Reduce gastos variables",
    "Aumenta tu fondo de emergencia"
  ]
}
```

**Notas importantes para frontend**

- Si falla el microservicio Python, este endpoint igualmente responde `200` con datos fallback.
- Si `usuarioId` no existe, actualmente puede responder `500`.

---

### `POST /api/v1/finanzas/clasificar`

Clasifica una transacción individual.

**Body JSON**

```json
{
  "descripcion": "Netflix",
  "valor": 15.99,
  "fecha_transaccion": "2026-08-17T20:30:00"
}
```

**Campos**

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `descripcion` | string | Sí | No vacío |
| `valor` | number (double) | Sí | `> 0` |
| `fecha_transaccion` | string datetime ISO-8601 | No | Puede omitirse |

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

**Nota**

- Si falla Python, responde `200` con valores fallback.

---

### `GET /api/v1/finanzas/historial/{usuarioId}`

Obtiene historial del usuario, ordenado del más reciente al más antiguo.

**Path params**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `usuarioId` | number (long) | Sí | ID del usuario |

**Respuesta 200**

```json
[
  {
    "id": 10,
    "perfilFinanciero": "Estable",
    "fechaAnalisis": "2026-08-17 20:31:10",
    "transacciones": [
      {
        "id": 101,
        "descripcion": "Supermercado",
        "valor": 120.5,
        "fechaTransaccion": "2026-08-17T20:30:00"
      }
    ],
    "categorias": [
      {
        "id": 201,
        "categoria": "Alimentación",
        "fechaRegistro": "2026-08-17T20:31:10"
      }
    ],
    "recomendaciones": [
      "Mantén un presupuesto mensual"
    ]
  }
]
```

**Campos relevantes del historial**

- En `AnalisisFinanciero` **no** se serializa `usuario` (está con `@JsonIgnore`).
- En `TransaccionAnalisis` y `CategoriaAnalisis` no se serializa `analisisFinanciero` (evita recursión JSON).

---

## Formato de errores (actual)

No hay manejador global de excepciones en `src/main/java` para estandarizar errores de negocio.  
Por eso hoy conviven respuestas:

1. Errores manuales JSON (ej. `DELETE /auth/eliminar` retorna `{ "error": ... }` con `404`).
2. Errores por validación Bean Validation (`400`).
3. Errores por `RuntimeException` (`500`), por ejemplo credenciales inválidas, email duplicado o `usuarioId` inexistente en análisis.

Para frontend, conviene tratar `4xx/5xx` como error genérico y leer `message/error/detail` si existe en la respuesta.

