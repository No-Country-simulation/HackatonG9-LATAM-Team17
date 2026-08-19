## Context
El componente `SettingsProfileView` administra la configuración personal, credenciales y parámetros financieros del usuario. Este componente tiene actualmente un diseño base sólido con TailwindCSS, pero la lógica de estado usa variables en inglés y su mecanismo para la eliminación de cuenta es un `setTimeout` simulado. El API backend expone `DELETE /api/v1/auth/eliminar?email={email}` para manejar la baja real de usuarios.

## Goals / Non-Goals
**Goals:**
- Traducir todas las variables reactivas (`useState`) al español con la sintaxis camelCase (`email` -> `correo`, `showDeleteModal` -> `mostrarModalEliminar`, etc.).
- Conectar el botón de confirmación de eliminación de cuenta para que ejecute una llamada asíncrona real (`fetch`) apuntando a `/api/v1/auth/eliminar?email={email}`.
- Manejar adecuadamente el estado de carga (`estaEliminando`) y los posibles errores (atrapándolos en un bloque try-catch), sin afectar la transición visual.
- Preservar el estilo (TailwindCSS) original e inalterable.

**Non-Goals:**
- No se implementarán integraciones (llamadas a endpoints) para guardar la información financiera/perfil en el backend ya que el API endpoints documentado (`API_BACKEND_ENDPOINTS.md`) no detalla rutas específicas de tipo `PUT` o `PATCH` para actualización de perfil, sino `POST /api/v1/finanzas/analizar` que se asume invocado en la vista principal o un endpoint de auth inexistente. Sólo se enfocará en el endpoint que SÍ coincide: la eliminación de cuenta.

## Decisions

**1. Mapeo del Endpoint DELETE**
- *Decisión*: Al escribir "ELIMINAR" en el modal y pulsar confirmar, el componente llamará a la URL usando el método `DELETE`. Se enviará el query parameter `email` tomado del estado `correo` asociado a la UI y derivado del prop `userProfile.email`. 
- *Racional*: Es exactamente lo que establece la documentación de backend. No se usará body porque la doc específica enviar como query parameter (`?email={email}`).

**2. Fallbacks de Error en Modal**
- *Decisión*: Si ocurre un error de red o el servidor responde con 400/500, se detendrá el spinner de carga (`estaEliminando = false`) y se alertará al usuario a través de un `console.error` o idealmente reutilizando la variable visual sin cerrar abruptamente el modal, para no arruinar la experiencia.

## Risks / Trade-offs
- **[Riesgo]** Conflicto de re-renders masivos si la refactorización al español de los `useState` se hace incorrectamente rompiendo el binding con JSX.
  - **Mitigación**: Se empleará sustitución precisa y compilación `tsc` para asegurar que cada nueva variable está debidamente referenciada en los `value` y handlers.
