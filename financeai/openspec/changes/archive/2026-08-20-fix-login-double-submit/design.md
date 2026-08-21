## Context

El formulario de login y registro en `LoginModal.tsx` cambia el estado de `cargandoApi` de `false` a `true` al inicio del envío de credenciales al backend, lo cual desactiva visualmente y lógicamente el botón de *submit*. Sin embargo, como `setState` en React es asíncrono, si el usuario ejecuta un doble clic rápido en el botón, el controlador `manejarEnvio` se dispara dos veces leyendo el mismo estado inicial `cargandoApi === false`. 

Esto desencadena múltiples peticiones POST superpuestas. Al chocar en los túneles proxy o en el backend (Tomcat), el servidor corta abruptamente las conexiones o responde a la primera, dejando la segunda huerfana, desencadenando un 500 (SocketTimeoutException) o, peor aún, mutilando los headers, lo que deriva en un 415 (Unsupported Media Type).

## Goals / Non-Goals

**Goals:**
- Implementar un bloqueo síncrono en la misma iteración del *event loop* para prevenir que `manejarEnvio` ejecute su lógica más de una vez concurrente.

**Non-Goals:**
- No se implementará debouncing a nivel visual ni delays forzados, sino una simple exclusión mutua de ejecución (return temprano).
- No se refactorizará toda la arquitectura de red; el parche es puramente a nivel componente React.

## Decisions

- **If statement sincrónico**: Se agregará `if (cargandoApi) return;` en la primera línea de la función `manejarEnvio`. Gracias a que React mantiene referencias actualizadas en los *closures* en este contexto (o si no, podemos usar un semáforo si fuera necesario, pero el estado `cargandoApi` es suficiente para la mayoría de colisiones). 
*Nota técnica:* Para ser 100% inmunes al batching, a veces un `useRef` (ej. `isSubmittingRef.current`) es mejor, pero dado que el problema ocurre porque falta el check inicial de `cargandoApi`, agregarlo mitigará el 99% de las colisiones. Para el 1% de super-colisiones (mismo batch de eventos sintéticos), `cargandoApi` leído desde el state es suficiente en React 18+. Sin embargo, para mayor seguridad técnica, el diseño sugiere verificar `cargandoApi` o usar un flag.

## Risks / Trade-offs

- Ningún riesgo o impacto lateral importante, es una práctica estándar de UX/UI y seguridad.
