# Plan de Implementación: Endpoints de Actualización de Perfil y Parámetros Financieros

**Fecha de diseño:** 2026-08-21
**Estado:** Planificado — pendiente de implementación
**Solicitado por:** Equipo de frontend (vista Perfil/Ajustes + Onboarding)

Este documento describe el plan técnico para los 2 endpoints solicitados. Se actualizará conforme avance la implementación (ver sección "Bitácora de avance" al final).

---

## Resumen de endpoints a crear

| # | Endpoint | Método | Propósito |
|---|----------|--------|-----------|
| 1 | `/api/v1/auth/usuarios/{id}` | PUT | Actualizar nombre y email del usuario |
| 2 | `/api/v1/finanzas/parametros/{usuarioId}` | PUT | Actualizar ingreso, deuda y frecuencia de ahorro (upsert) |

> **Nota de ruta:** para el endpoint 1 se usa `/api/v1/auth/usuarios/{id}` en vez de `/api/v1/usuarios/{id}` (alternativa que proponía el frontend) para mantener el prefijo `/auth` ya usado por login/registro/eliminar en `AuthController`, evitando crear un controller nuevo solo para esto.

---

## Endpoint 1: `PUT /api/v1/auth/usuarios/{id}`

> **Decisión de diseño (confirmada 2026-08-21):** el endpoint soporta **actualización parcial (estilo PATCH sobre un PUT)** — el usuario puede enviar solo `nombre`, solo `email`, o ambos en la misma solicitud. Ningún campo es obligatorio individualmente, pero **al menos uno debe estar presente**, para no permitir un PUT vacío que no cambie nada. Esto no quita la funcionalidad de actualizar ambos a la vez: sigue siendo posible enviando los dos campos juntos.

### Archivos a tocar
| Archivo | Tipo de cambio |
|---|---|
| `dto/request/ActualizarUsuarioRequestDTO.java` | **Nuevo** |
| `repository/UsuarioRepository.java` | Modificado (nuevo método) |
| `service/AuthService.java` | Modificado (nuevo método `actualizarUsuario`) |
| `controller/AuthController.java` | Modificado (nuevo endpoint) |

### Diseño del DTO de entrada (campos opcionales, sin `@NotBlank`)
```java
@AlMenosUnCampoPresente // validación de clase custom, ver detalle abajo
public record ActualizarUsuarioRequestDTO(
        @Size(min = 1, message = "El nombre no puede estar vacío") String nombre,
        @Email(message = "Debe ser un formato de correo válido") String email
) {}
```
- Se elimina `@NotBlank` de ambos campos (a diferencia de `RegistroRequestDTO`), porque aquí "ausente" es un valor válido (significa "no tocar este campo").
- `@Email` se sigue aplicando **solo si el campo viene presente** — Bean Validation ignora `@Email` sobre valores `null` por defecto, así que no rechaza un `email` ausente, solo valida el formato si se envía algo.

**Validación "al menos un campo presente":** en vez de lanzar una excepción manual desde el servicio (lo cual requeriría decidir con qué código HTTP responder), se implementa como una **anotación de validación a nivel de clase** (`@AlMenosUnCampoPresente`, con su `ConstraintValidator`), igual que cualquier otra regla de Bean Validation. Esto tiene una ventaja clave: **reutiliza el handler ya existente `MethodArgumentNotValidException` → 400 Bad Request** (handler #4 de `GlobalExceptionHandler`), sin necesidad de crear ninguna excepción ni handler nuevo.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AlMenosUnCampoPresenteValidator.class)
public @interface AlMenosUnCampoPresente {
    String message() default "Debes enviar al menos el nombre o el email a actualizar.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class AlMenosUnCampoPresenteValidator
        implements ConstraintValidator<AlMenosUnCampoPresente, ActualizarUsuarioRequestDTO> {
    @Override
    public boolean isValid(ActualizarUsuarioRequestDTO dto, ConstraintValidatorContext ctx) {
        boolean nombrePresente = dto.nombre() != null && !dto.nombre().isBlank();
        boolean emailPresente = dto.email() != null && !dto.email().isBlank();
        return nombrePresente || emailPresente;
    }
}
```

### Diseño del repositorio (nuevo método)
```java
boolean existsByEmailAndIdNot(String email, Long id);
```
Se usa **solo si `email` viene presente en el request** — si el usuario no envía `email`, no se valida unicidad (no se está tocando ese campo).

### Diseño del servicio (actualización parcial explícita)
```java
public Usuario actualizarUsuario(Long id, ActualizarUsuarioRequestDTO request) {
    // La validación de "al menos un campo presente" ya la resolvió @Valid en el controller
    // (vía @AlMenosUnCampoPresente) antes de llegar aquí.

    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

    // Solo se actualiza el nombre si el cliente lo envió
    if (request.nombre() != null && !request.nombre().isBlank()) {
        usuario.setNombre(request.nombre());
    }

    // Solo se actualiza el email si el cliente lo envió, validando unicidad
    if (request.email() != null && !request.email().isBlank()) {
        if (usuarioRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new EntityAlreadyExistsException("El correo electrónico ya está en uso por otro usuario.");
        }
        usuario.setEmail(request.email());
    }

    return usuarioRepository.save(usuario);
}
```
**Casos cubiertos:**
- Solo `nombre` → actualiza únicamente el nombre, `email` permanece igual.
- Solo `email` → actualiza únicamente el email (validando duplicado), `nombre` permanece igual.
- Ambos → actualiza los dos en la misma transacción (funcionalidad original, preservada).
- Ninguno / body vacío → rechazado en la fase de validación (`400 Bad Request` vía `@Valid`), antes de tocar el servicio o la BD.

### Diseño del controller (sin cambios respecto al plan anterior)
```java
@PutMapping("/usuarios/{id}")
public ResponseEntity<Map<String, Object>> actualizarUsuario(
        @PathVariable Long id,
        @Valid @RequestBody ActualizarUsuarioRequestDTO request) {
    Usuario usuario = authService.actualizarUsuario(id, request);
    return ResponseEntity.ok(Map.of(
            "mensaje", "Perfil actualizado correctamente",
            "id", usuario.getId(),
            "nombre", usuario.getNombre(),
            "email", usuario.getEmail(),
            "status", "success"
    ));
}
```

### Impacto en base de datos
**Ninguno.** Reutiliza la tabla `usuarios` existente sin cambios de esquema.

---

## Endpoint 2: `PUT /api/v1/finanzas/parametros/{usuarioId}`

### Hallazgo importante que cambia el alcance
Como se detectó en el análisis previo, **hoy no existe ninguna tabla que persista `ingreso_mensual`, `deuda_total`, `frecuencia_ahorro` ni `nivel_endeudamiento`** de forma independiente — solo existen como inputs efímeros de `AnalisisInputDTO` al generar un análisis. Por lo tanto, este endpoint requiere **crear un nuevo modelo de persistencia**, no solo un método PUT.

### Archivos a tocar
| Archivo | Tipo de cambio |
|---|---|
| `model/ParametrosFinancieros.java` | **Nuevo** |
| `repository/ParametrosFinancierosRepository.java` | **Nuevo** |
| `dto/request/ActualizarParametrosRequestDTO.java` | **Nuevo** |
| `dto/response/ParametrosResponseDTO.java` | **Nuevo** |
| `service/AnalisisService.java` | Modificado (nuevo método) |
| `controller/AnalisisController.java` | Modificado (nuevo endpoint) |

### Diseño de la entidad (nueva tabla `parametros_financieros`)
```java
@Entity
@Table(name = "parametros_financieros")
public class ParametrosFinancieros {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "ingreso_mensual", nullable = false)
    private Double ingresoMensual;

    @Column(name = "deuda_total", nullable = false)
    private Double deudaTotal;

    @Column(name = "frecuencia_ahorro", nullable = false)
    private String frecuenciaAhorro;

    @Column(name = "nivel_endeudamiento", nullable = false)
    private Double nivelEndeudamiento; // calculado, no viene del cliente

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}
```
- Relación `@OneToOne` con `usuario_id UNIQUE` → un solo registro de parámetros por usuario (upsert, no historial).
- Con `ddl-auto=update` (configuración actual del proyecto, confirmada en `application.properties`), **Hibernate creará la tabla automáticamente** al levantar la app — no se requiere script de migración manual.

### Diseño del DTO de entrada (sin `nivel_endeudamiento`, confirmando la sugerencia del frontend)
```java
public record ActualizarParametrosRequestDTO(
        @NotNull @Positive
        @JsonProperty("ingreso_mensual") Double ingresoMensual,

        @NotNull @PositiveOrZero
        @JsonProperty("deuda_total") Double deudaTotal,

        @NotNull
        @JsonProperty("frecuencia_ahorro") String frecuenciaAhorro
) {}
```

### Diseño del DTO de salida
```java
public record ParametrosResponseDTO(
        @JsonProperty("ingreso_mensual") Double ingresoMensual,
        @JsonProperty("deuda_total") Double deudaTotal,
        @JsonProperty("frecuencia_ahorro") String frecuenciaAhorro,
        @JsonProperty("nivel_endeudamiento") Double nivelEndeudamiento
) {}
```

### Diseño del servicio (upsert + cálculo)
```java
public ParametrosResponseDTO actualizarParametros(Long usuarioId, ActualizarParametrosRequestDTO request) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

    ParametrosFinancieros parametros = parametrosRepository.findByUsuarioId(usuarioId)
            .orElseGet(() -> ParametrosFinancieros.builder().usuario(usuario).build());

    parametros.setIngresoMensual(request.ingresoMensual());
    parametros.setDeudaTotal(request.deudaTotal());
    parametros.setFrecuenciaAhorro(request.frecuenciaAhorro());

    // Nivel de endeudamiento SIEMPRE calculado en backend (no se confía en el valor del cliente)
    double nivel = request.ingresoMensual() > 0
            ? (request.deudaTotal() / request.ingresoMensual()) * 100
            : 0.0;
    parametros.setNivelEndeudamiento(nivel);
    parametros.setFechaActualizacion(LocalDateTime.now());

    parametrosRepository.save(parametros);

    return new ParametrosResponseDTO(
            parametros.getIngresoMensual(),
            parametros.getDeudaTotal(),
            parametros.getFrecuenciaAhorro(),
            parametros.getNivelEndeudamiento()
    );
}
```
> **Decisión de diseño confirmada:** el backend calcula `nivel_endeudamiento`, tal como el propio frontend propuso como opción preferida — evita que el cliente pueda enviar un valor inconsistente o manipulado.
> **Caso borde cubierto:** división por cero si `ingreso_mensual = 0` — ya bloqueado por `@Positive` en el DTO (rechaza 0 y negativos con 400 antes de llegar al cálculo).

### Impacto en base de datos
**Se crea una tabla nueva:** `parametros_financieros`, con relación 1:1 a `usuarios`. No afecta tablas existentes (`usuarios`, `analisis_financiero`, etc.).

---

## Excepciones y códigos HTTP (reutilizados, sin nuevos handlers)

| Escenario | Excepción | Status |
|---|---|---|
| Usuario no existe (ambos endpoints) | `ResourceNotFoundException` | 404 |
| Email ya usado por otro usuario (endpoint 1) | `EntityAlreadyExistsException` | 409 |
| Validación de campos (`@Valid`) | `MethodArgumentNotValidException` | 400 |

Ambas excepciones y sus handlers **ya existen** en `GlobalExceptionHandler` — no se requiere ninguno nuevo.

---

## Orden de implementación propuesto

1. Endpoint 1 (más simple, sin cambios de esquema): DTO → repositorio → servicio → controller.
2. Endpoint 2 (requiere nueva entidad): entidad → repositorio → DTOs → servicio → controller.
3. Pruebas manuales de ambos endpoints (Swagger/curl): casos felices, email duplicado, usuario inexistente, ingreso en 0.
4. Documentación final de contratos JSON para el equipo de frontend.

---

## Preguntas abiertas para confirmar con el frontend antes de implementar

1. ~~¿El endpoint 1 debe permitir cambiar solo un campo o siempre ambos?~~ **Resuelto (2026-08-21):** soporta actualización parcial — `nombre` y `email` son independientes entre sí, se envía el que se quiera cambiar, ambos siguen siendo aceptados juntos. Ver detalle de diseño arriba.
2. ¿Es aceptable que `frecuencia_ahorro` no tenga una validación de valores permitidos (ej. enum `mensual`/`quincenal`/`semanal`) o se debe restringir a una lista fija?
3. ¿Confirmar que no se requiere historial de cambios de parámetros financieros (solo el valor más reciente, sobrescribiendo el anterior)?

---

## Bitácora de avance

- **2026-08-21** — Plan diseñado y documentado. Aún no implementado. Pendiente de aprobación para iniciar.
- **2026-08-21** — Resuelta la pregunta abierta #1: el endpoint 1 soporta actualización parcial (nombre y/o email por separado, o ambos juntos), vía DTO con campos opcionales + validador de clase `@AlMenosUnCampoPresente`. Plan actualizado, aún sin implementar.
- **2026-08-21** — ✅ **Endpoint 1 implementado y compilado exitosamente.** Ver detalle completo de archivos tocados y verificación en la sección "Implementación realizada" al final de este documento. Endpoint 2 (parámetros financieros) sigue pendiente, solo planificado.

---

## Implementación realizada — Endpoint 1 (2026-08-21)

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

### Comportamiento final (verificado por diseño, no por test automatizado)
- `PUT /api/v1/auth/usuarios/{id}` con `{"nombre": "..."}` → actualiza solo el nombre.
- Con `{"email": "..."}` → actualiza solo el email (valida que no esté en uso por otro usuario vía `existsByEmailAndIdNot`).
- Con ambos campos → actualiza los dos.
- Con `{}` (body vacío) o ambos campos nulos/vacíos → **400 Bad Request** automático (vía `@Valid` + `@AlMenosUnCampoPresente`), sin llegar al servicio ni a la base de datos.
- Usuario inexistente → **404** (`ResourceNotFoundException`, reutilizado, sin nuevo handler).
- Email duplicado (de otro usuario) → **409** (`EntityAlreadyExistsException`, reutilizado, sin nuevo handler).

### Verificación técnica
- `mvn compile` ejecutado tras la implementación → **compilación exitosa sin errores**.
- No se ejecutaron pruebas manuales end-to-end (Swagger/curl) — sigue pendiente el todo `validacion-manual` para ambos endpoints (1 y 2).

### Impacto en base de datos
**Ninguno.** No se creó ninguna tabla ni columna nueva; se reutiliza `usuarios` sin cambios de esquema.

### Compatibilidad con lo existente
- No se modificó ningún endpoint existente (`/login`, `/registro`, `/eliminar`) — es puramente aditivo.
- Se reutilizaron excepciones y handlers ya existentes (`ResourceNotFoundException` → 404, `EntityAlreadyExistsException` → 409, `MethodArgumentNotValidException` → 400) — **no se agregó ningún handler nuevo en `GlobalExceptionHandler`**.
