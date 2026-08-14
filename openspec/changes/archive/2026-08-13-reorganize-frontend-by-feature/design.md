## Por qué esta estructura de carpetas (Feature-Sliced Design Lite)

La arquitectura plana actual (`src/components/` con todos los archivos mezclados) no escala. Al reorganizar el frontend en `src/features/`, logramos una alineación 1:1 con el backend de Spring Boot:
- El `AnalisisController` mapeará conceptualmente a `src/features/analisis`.
- El `TransaccionController` mapeará a `src/features/transacciones`.

Esta encapsulación permite que cada feature posea sus propios componentes, hooks (lógica) y llamadas a la API, facilitando el mantenimiento y reduciendo el riesgo de acoplamiento accidental.

## Relación Frontend-Backend

- **`features/transacciones/`**: Encapsulará los componentes visuales de la tabla y formulario de gastos, y eventualmente agrupará la lógica de `fetch` a `/api/v1/transacciones` en su subcarpeta `api/`.
- **`features/analisis/`**: Encapsulará los componentes de resultado (probabilidad, recomendaciones) y el trigger a `/api/v1/analisis/perfil`.

## Organización de Shared Styles

Dado que los dos archivos `DESIGN.md` de referencia dictan exactamente el mismo sistema de diseño, alojaremos los tokens y estilos compartidos en `src/features/shared/styles/`. 
Esto asegura que las directivas como `.interactive-card` estén disponibles globalmente para cualquier feature, evitando la duplicación de bloques de CSS y manteniendo la fidelidad al estilo "The Encouraging Expert".
