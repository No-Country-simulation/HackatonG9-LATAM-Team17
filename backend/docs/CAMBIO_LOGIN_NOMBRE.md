
# Cambio: Campo `nombre` en la respuesta de `POST /api/v1/auth/login`

**Fecha:** 2026-08-20
**Endpoint afectado:** `POST /api/v1/auth/login`
**Archivos modificados:** `AuthController.java`, `AuthService.java`

---

## 1. Motivo del cambio

El frontend necesitaba mostrar el nombre completo del usuario autenticado (ej. en un saludo o en el perfil), pero la respuesta del login **no incluía ese dato como campo independiente**, solo estaba embebido dentro del texto del `mensaje` (`"Bienvenido de nuevo, Ana Perez"`). Como workaround, el frontend extraía el nombre cortando el email (`"ana@email.com"` → `"ana"`), lo cual no coincide con el nombre real registrado y no soporta nombres compuestos.

No existe actualmente un endpoint `GET /perfil` para consultar este dato por separado, por lo que se decidió exponerlo directamente en la respuesta del login.

---

## 2. Qué se implementó

### Antes

```json
{
  "mensaje": "Bienvenido de nuevo, Ana Perez",
  "email": "ana@email.com",
  "id": 1,
  "token": "fake-jwt-token-for-session",
  "status": "success"
}
```

### Ahora

```json
{
  "mensaje": "Bienvenido de nuevo, Ana Perez",
  "nombre": "Ana Perez",
  "email": "ana@email.com",
  "id": 1,
  "token": "fake-jwt-token-for-session",
  "status": "success"
}
```

`nombre` contiene exactamente el mismo valor que el usuario ingresó en `POST /registro` y que está persistido en la columna `usuarios.nombre` — no se transforma ni se recorta.

---

## 3. Cambios técnicos realizados

1. **`AuthService.autenticarUsuario(LoginRequestDTO)`**:
   - Antes retornaba `String` (el mensaje de bienvenida ya concatenado: `"Bienvenido de nuevo, " + usuario.getNombre()`).
   - Ahora retorna la entidad **`Usuario`** completa. La construcción del mensaje de bienvenida se movió al controller.
   - Motivo: el servicio ya tenía el objeto `Usuario` cargado en memoria (viene de `findByEmail`) — no hace falta ninguna consulta adicional a la base de datos, solo se cambió qué se retorna.

2. **`AuthController.loginUsuario`**:
   - Recibe ahora el objeto `Usuario` en vez de un `String`.
   - Construye el `mensaje` (`"Bienvenido de nuevo, " + usuario.getNombre()`) igual que antes, pero ahora en el controller.
   - Agrega la clave `"nombre"` al `Map.of(...)` de respuesta con `usuario.getNombre()`.

**No se tocó:** el repositorio, el modelo `Usuario`, la base de datos, ni el flujo de registro. El dato ya estaba persistido y disponible.

---

## 4. Impacto para el equipo de backend

- **Cero impacto en base de datos**: no se agregó ninguna columna ni migración. `nombre` ya existía en `Usuario`.
- **Cambio de contrato interno**: si algún otro componente del backend llegara a invocar `AuthService.autenticarUsuario(...)` esperando un `String`, se rompería en compilación (tipo de retorno cambió a `Usuario`). Se verificó con `grep` que **el único invocador es `AuthController.loginUsuario`**, ya actualizado — no hay otros consumidores afectados.
- **Sin cambios de rendimiento**: la consulta a BD (`findByEmail`) es la misma que ya se ejecutaba; no se agregó ningún query adicional.
- **Compatibilidad hacia adelante**: es un cambio **aditivo** en el JSON de respuesta (se agrega una clave nueva, no se quita ni renombra ninguna existente) → no rompe a ningún consumidor actual del frontend que ignore campos desconocidos.

## 5. Impacto para el equipo de frontend

- Pueden reemplazar la lógica de "cortar el email" por lectura directa de `response.nombre`.
- El campo `mensaje` sigue existiendo con el mismo formato de texto (no es necesario parsear el string para extraer el nombre).

---

## 6. Deuda técnica

### ✅ RESUELTA (2026-08-21): `"id": 1` hardcodeado

**Causa raíz confirmada:** este bug fue la explicación real de un 404 reportado al probar el nuevo endpoint `PUT /api/v1/auth/usuarios/{id}` — el frontend usaba el `id` devuelto por el login (siempre `1`) para armar la ruta, y ese usuario no existe en la base de datos actual (se verificó en vivo: `PUT /usuarios/1` → 404 "Usuario no encontrado", mientras que `GET /historial` sí devuelve datos de un usuario real con otro ID).

**Cambio aplicado:** en `AuthController.loginUsuario`, se reemplazó el literal `1` por `usuario.getId()`:

```java
// Antes
"id", 1,

// Ahora
"id", usuario.getId(),
```

No se requirió ningún cambio adicional en `AuthService` — el objeto `Usuario` retornado por `autenticarUsuario` ya expone `getId()`.

**Verificación:** `mvn compile` exitoso. **Importante:** si el backend ya estaba corriendo (ej. desde el IDE) al aplicar este cambio, **debe reiniciarse el proceso** para que la nueva respuesta tome efecto — un `mvn compile` no recarga un servidor Spring Boot ya en ejecución fuera de un dev-tools con hot reload.

**Confirmación del frontend:** el equipo de frontend confirmó que ya lee dinámicamente el campo `id` del JSON de login para construir la ruta de `PUT /usuarios/{id}` — **no requieren ningún cambio adicional de su lado**, el fix del backend es autosuficiente una vez desplegado/reiniciado.

### ⚠️ Pendiente (fuera de alcance, sin cambios)

- **`"token": "fake-jwt-token-for-session"`** sigue siendo un string estático, no un JWT real — no hay validación de sesión/expiración basada en este token. Se recomienda levantar un ticket separado si se requiere autenticación real basada en tokens.

---

## 7. Verificación realizada

- `mvn compile` ejecutado tras los cambios → compilación exitosa sin errores (tanto en el cambio original del campo `nombre` como en la corrección posterior del `id`).
- Se confirmó (vía búsqueda en el código) que no existen otros llamadores de `AuthService.autenticarUsuario` afectados por el cambio de tipo de retorno.
- Se confirmó **en vivo** contra el backend corriendo localmente que la ruta `PUT /api/v1/auth/usuarios/{id}` coincide exactamente con la especificación, usa el método HTTP correcto, y que el 404 reportado era de negocio (`ResourceNotFoundException`) causado por el `id` hardcodeado — no un problema de ruta, método, ni de rama sin mergear.
