## Context

El backend de Spring Boot ha evolucionado su API. El endpoint genérico ha sido reemplazado por un endpoint segmentado por perfil de usuario. Actualmente, la UI falla con un error `404` (mapeado como estático en Spring) porque sigue intentando golpear la ruta obsoleta.

## Goals / Non-Goals

**Goals:**
- Establecer comunicación exitosa entre React y Spring Boot.
- Utilizar el endpoint correcto `/api/v1/analisis/perfil/{usuarioId}`.
- Preservar la experiencia de usuario (UX) intacta ante caídas del servidor local.

**Non-Goals:**
- Implementar un flujo real de autenticación. Utilizaremos el mock `USR-1001` de forma temporal.
- Refactorizar el componente `FormularioAnalisis.tsx` más allá del bloque del `fetch`.

## Decisions

1. **Hardcoding Temporal del Usuario**:
   Se inyectará directamente la URL `http://localhost:8080/api/v1/analisis/perfil/USR-1001`.
   *Razón*: Mantiene el alcance de esta corrección lo más reducido y directo posible, permitiendo desbloquear el desarrollo inmediatamente. Cuando se diseñe el módulo de login, este ID se leerá de un contexto o token.

## Risks / Trade-offs

- **Deuda Técnica**: El ID `USR-1001` quedará en el código fuente del componente temporalmente. 
  - *Mitigación*: En el momento en que se implemente la V3 con usuarios, deberá parametrizarse.
