# Endpoint de Actualización de Perfil — Implementado

**Fecha de diseño:** 2026-08-21
**Estado:** ✅ Implementado y compilado exitosamente (2026-08-21)
**Solicitado por:** Equipo de frontend (vista Perfil/Ajustes)

Este documento describe el endpoint de actualización de perfil tal como quedó implementado en el código actual.

---

## Endpoint: `PUT /api/v1/auth/usuarios/{id}`

Actualiza el nombre y/o el email de un usuario.

> **Nota de ruta:** se usa `/api/v1/auth/usuarios/{id}` en vez de `/api/v1/usuarios/{id}` (alternativa que proponía el frontend) para mantener el prefijo `/auth` ya usado por login/registro/eliminar en `AuthController`, evitando crear un controller nuevo solo para esto.

> **Decisión de diseño (confirmada 2026-08-21):** el endpoint soporta **actualización parcial (estilo PATCH sobre un PUT)** — el usuario puede enviar solo `nombre`, solo `email`, o ambos en la misma solicitud. Ningún campo es obligatorio individualmente, pero **al menos uno debe estar presente**, para no permitir un PUT vacío que no cambie nada.

### Archivos creados
| Archivo | Contenido |
|---|---|
| `validation/AlMenosUnCampoPresente.java` | Anotación de validación a nivel de clase |
| `validation/AlMenosUnCampoPresenteValidator.java` | Lógica del validador: exige `nombre` y/o `email` no nulos/no vacíos |
| `dto/request/ActualizarUsuarioRequestDTO.java` | DTO con `nombre` y `email` opcionales, anotado con `@AlMenosUnCampoPresente` |

### Archivos modificados
| Archivo | Cambio |
|---|---|
| `repository/UsuarioRepository.java` | Se agregó `existsByEmailAndIdNot(String email, Long id)` |
| `service/AuthService.java` | Se agregó `actualizarUsuario(Long id, ActualizarUsuarioRequestDTO request)` — actualiza solo los campos presentes |
| `controller/AuthController.java` | Se agregó `PUT /api/v1/auth/usuarios/{id}` |

### DTO de entrada (campos opcionales, sin `@NotBlank`)
```java
@AlMenosUnCampoPresente // validación de clase custom
public record ActualizarUsuarioRequestDTO(
        @Size(min = 1, message = "El nombre no puede estar vacío") String nombre,
        @Email(message = "Debe ser un formato de correo válido") String email
) {}
```
- No lleva `@NotBlank` (a diferencia de `RegistroRequestDTO`), porque aquí "ausente" es un valor válido (significa "no tocar este campo").
- `@Email` se aplica **solo si el campo viene presente** — Bean Validation ignora `@Email` sobre valores `null`.

**Validación "al menos un campo presente":** implementada como anotación de validación a nivel de clase (`@AlMenosUnCampoPresente`, con su `ConstraintValidator`). Ventaja clave: **reutiliza el handler ya existente `MethodArgumentNotValidException` → 400 Bad Request** de `GlobalExceptionHandler`, sin necesidad de excepción ni handler nuevo.

### Repositorio (nuevo método)
```java
boolean existsByEmailAndIdNot(String email, Long id);
```
Se usa **solo si `email` viene presente en el request** — si el usuario no envía `email`, no se valida unicidad.

### Comportamiento (verificado por diseño, no por test automatizado)
- `PUT /api/v1/auth/usuarios/{id}` con `{"nombre": "..."}` → actualiza solo el nombre.
- Con `{"email": "..."}` → actualiza solo el email (valida que no esté en uso por otro usuario vía `existsByEmailAndIdNot`).
- Con ambos campos → actualiza los dos.
- Con `{}` (body vacío) o ambos campos nulos/vacíos → **400 Bad Request** automático (vía `@Valid` + `@AlMenosUnCampoPresente`), sin llegar al servicio ni a la base de datos.
- Usuario inexistente → **404** (`ResourceNotFoundException`, reutilizada, sin nuevo handler).
- Email duplicado (de otro usuario) → **409** (`EntityAlreadyExistsException`, reutilizada, sin nuevo handler).

### Respuesta 200
```json
{
  "mensaje": "Perfil actualizado correctamente",
  "id": 15,
  "nombre": "Ana Perez Editada",
  "email": "ana.nueva@email.com",
  "status": "success"
}
```

### Excepciones y códigos HTTP (reutilizados, sin nuevos handlers)

| Escenario | Excepción | Status |
|---|---|---|
| Usuario no existe | `ResourceNotFoundException` | 404 |
| Email ya usado por otro usuario | `EntityAlreadyExistsException` | 409 |
| Validación de campos (`@Valid`) | `MethodArgumentNotValidException` | 400 |

### Impacto en base de datos
**Ninguno.** No se creó ninguna tabla ni columna nueva; se reutiliza `usuarios` sin cambios de esquema.

### Compatibilidad con lo existente
- No se modificó ningún endpoint existente (`/login`, `/registro`, `/eliminar`) — es puramente aditivo.
- Se reutilizaron excepciones y handlers ya existentes — **no se agregó ningún handler nuevo en `GlobalExceptionHandler`**.

### Verificación técnica
- `mvn compile` ejecutado tras la implementación → **compilación exitosa sin errores**.
- No se ejecutaron pruebas manuales end-to-end (Swagger/curl) — pendiente.

---

## Bitácora de avance

- **2026-08-21** — Plan diseñado y documentado.
- **2026-08-21** — Resuelta la pregunta abierta: el endpoint soporta actualización parcial (nombre y/o email por separado, o ambos juntos), vía DTO con campos opcionales + validador de clase `@AlMenosUnCampoPresente`.
- **2026-08-21** — ✅ **Endpoint implementado y compilado exitosamente.**
- **2026-08-24** — Documento depurado: se eliminó el diseño del endpoint de parámetros financieros (`PUT /finanzas/parametros/{usuarioId}`) por no estar implementado en el código actual. Este documento refleja únicamente lo que existe en el código.
