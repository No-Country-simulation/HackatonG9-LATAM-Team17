# Cambios funcionales pendientes de subir a GitHub

**Fecha del reporte:** 2026-08-21
**Rama:** `feature/back-estructura-capas-clon`
**Estado:** Todos estos cambios existen **solo en local**, no están commiteados ni pusheados.
---

## 1. Login: se agrega el nombre real del usuario y se corrige el ID hardcodeado

**Archivos:** `AuthController.java`, `AuthService.java`

**Para qué sirve:** El frontend necesitaba el nombre completo del usuario (antes lo sacaba
cortando el email) y el ID real en base de datos (antes el login devolvía siempre `"id": 1`,
sin importar qué usuario iniciara sesión).

**Respuesta del login, antes:**
```json
{ "mensaje": "Bienvenido de nuevo, Ana", "email": "ana@email.com", "id": 1, "token": "...", "status": "success" }
```

**Respuesta del login, ahora:**
```json
{ "mensaje": "Bienvenido de nuevo, Ana Perez", "nombre": "Ana Perez", "email": "ana@email.com", "id": 15, "token": "...", "status": "success" }
```

**Impacto:** Corrige un bug real — con el `id` hardcodeado, cualquier operación del
frontend que dependiera del ID de sesión (por ejemplo el nuevo endpoint de perfil, punto 3)
apuntaba siempre al usuario 1, fallando con 404 si ese usuario no existía.

---

## 2. Login y Registro: manejo correcto de errores de autenticación

**Archivos:** `AuthService.java`, `GlobalExceptionHandler.java`, nuevo
`exception/AuthenticationFailedException.java`

**Para qué sirve:** Antes, si el usuario no existía o la contraseña era incorrecta, el
backend lanzaba un `RuntimeException` genérico que caía en el manejador catch-all y
devolvía **500 Internal Server Error** — un código que el frontend no puede distinguir de
un error real del servidor. Igual pasaba al registrar un email ya existente.

**Cambio:**
- Login con credenciales inválidas → ahora responde **401 Unauthorized** (antes 500).
  El mensaje es el mismo para "usuario no existe" y "contraseña incorrecta" (por seguridad,
  no se revela cuál de los dos falló).
- Registro con email duplicado → ahora responde **409 Conflict** (antes 500).

**Impacto:** El frontend ahora puede diferenciar "credenciales incorrectas" de un error real
de servidor y mostrar mensajes apropiados al usuario.

---

## 3. Nuevo endpoint: actualización de perfil (nombre / email)

**Archivos nuevos:**
- `dto/request/ActualizarUsuarioRequestDTO.java`
- `validation/AlMenosUnCampoPresente.java` + `AlMenosUnCampoPresenteValidator.java`

**Archivos modificados:** `AuthController.java`, `AuthService.java`, `UsuarioRepository.java`

**Endpoint:** `PUT /api/v1/auth/usuarios/{id}`

**Para qué sirve:** Permite editar el nombre y/o el email de un usuario desde la pantalla
de Perfil, sin necesidad de generar un nuevo registro ni loguearse de nuevo.

**Soporta actualización parcial** — se puede enviar:
- Solo `nombre`
- Solo `email`
- Ambos a la vez

```json
{ "nombre": "Ana Perez Editada" }
```
```json
{ "email": "ana.nueva@email.com" }
```
```json
{ "nombre": "Ana Perez Editada", "email": "ana.nueva@email.com" }
```

**Validaciones:**
- Si no se envía **ningún** campo → **400 Bad Request** (validación `@AlMenosUnCampoPresente`).
- Si el email ya está en uso por **otro** usuario → **409 Conflict** (se agregó
  `existsByEmailAndIdNot` al repositorio para excluir al propio usuario de la comprobación).
- Si el `id` no existe en base de datos → **404 Not Found**.

**Impacto:** Nueva funcionalidad solicitada para completar la vista de Perfil/Ajustes.
No rompe nada existente.

---

## 4. Historial de análisis: paginación

**Archivos:** `AnalisisController.java`, `AnalisisService.java`,
`AnalisisFinancieroRepository.java`

**Endpoints afectados:** `GET /api/v1/finanzas/historial` y
`GET /api/v1/finanzas/historial/{usuarioId}`

**Para qué sirve:** Evita traer todos los registros históricos de golpe (riesgo de
sobrecarga en base de datos y en el frontend si un usuario acumula miles de análisis).
Ahora se traen solo los registros de la página solicitada.

**⚠️ BREAKING CHANGE — el formato de la respuesta cambia:**

Antes devolvía un array plano:
```json
[ { "id": 1, ... }, { "id": 2, ... } ]
```

Ahora devuelve un objeto `Page` de Spring:
```json
{
  "content": [ { "id": 1, ... }, { "id": 2, ... } ],
  "totalElements": 45,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```

**El frontend debe leer `response.content`** en vez de iterar la respuesta directamente,
o el código existente se romperá.

**Parámetros nuevos (query params, opcionales):**
- `page` (default `0`)
- `size` (default `10`, máximo forzado a `100` para evitar abuso)
- Orden por defecto: `fechaAnalisis` descendente (más reciente primero).

**Impacto:** Requiere cambio en el frontend para adaptarse al nuevo formato antes de
desplegar esto en producción — coordinar el despliegue conjunto.

---

## Resumen para el equipo de backend

| # | Cambio | Endpoint(s) | Tipo | Rompe compatibilidad? |
|---|--------|-------------|------|------------------------|
| 1 | Login con `nombre` real + `id` real | `POST /auth/login` | Fix + mejora | No (solo agrega campos) |
| 2 | Errores de auth con status correcto (401/409) | `POST /auth/login`, `POST /auth/registro` | Fix | No (antes era 500, ahora más específico) |
| 3 | Actualización parcial de perfil | `PUT /auth/usuarios/{id}` (nuevo) | Feature nueva | No |
| 4 | Paginación de historial | `GET /finanzas/historial[/{usuarioId}]` | Mejora | **Sí** — cambia forma de la respuesta |

**Documentación detallada de cada tema** (ya existente en el repo, sin subir aún):
- `docs/API_BACKEND_ENDPOINTS.md` — referencia completa de todos los endpoints actualizada.
- `docs/EXCEPCIONES_BACKEND.md` — todos los códigos de error y su manejo.
- `docs/CAMBIO_LOGIN_NOMBRE.md` — detalle específico del cambio de login.
- `docs/PLAN_ENDPOINTS_PERFIL_PARAMETROS.md` — diseño e implementación del endpoint de perfil (`PUT /auth/usuarios/{id}`).

---
