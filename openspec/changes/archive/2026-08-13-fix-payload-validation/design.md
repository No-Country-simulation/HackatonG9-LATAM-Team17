## Context

El DTO del backend en Spring Boot (`AnalisisInputDTO`) tiene validaciones `@NotBlank` y `@NotNull` estrictas sobre los campos `descripcion` y `valor` de cada `TransaccionDTO`. Si el frontend permite inyectar gastos vacíos, la comunicación se rompe en Bean Validation.

## Goals / Non-Goals

**Goals:**
- Bloquear envíos malformados en `FormularioAnalisis.tsx` antes de que toquen la red.
- Validar las transacciones individuales.
- Proveer *feedback* visual (alerta roja) al usuario para que corrija su entrada.

**Non-Goals:**
- Refactorizar el componente `SeccionIngresoGastos` internamente (la protección se hará en la raíz del formulario, que es la que empaqueta y envía el payload).

## Decisions

1. **Bloqueo vs. Filtro Silencioso**: En lugar de "limpiar" las transacciones inválidas de forma silenciosa (lo cual podría confundir al usuario que ve 3 items pero envía 2), decidimos **bloquear el envío** y mostrar un `setValidationError()`.
*Rationale*: Es la mejor práctica de UX indicar claramente qué datos son inválidos, manteniendo transparencia total con lo que el usuario ve vs. lo que el sistema procesa.

## Risks / Trade-offs

- **Bloqueo Frustrante**: Si la validación es demasiado agresiva (ej: espacios en blanco imperceptibles), el usuario no sabrá qué arreglar.
*Mitigación*: Se hará `.trim()` de la descripción para evitar que "   " pase, y el mensaje de error será sumamente descriptivo.
