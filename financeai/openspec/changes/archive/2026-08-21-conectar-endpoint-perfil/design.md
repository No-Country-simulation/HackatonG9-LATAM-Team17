## Context
Actualmente `SettingsProfileView.tsx` permitía editar tanto información personal (nombre, email, etc.) como parámetros financieros, pero no había un endpoint real conectado para guardar esos cambios de perfil. Ahora, el backend ha provisto `PUT /api/v1/auth/usuarios/{id}` que permite actualizar `nombre` y `email` parcialmente. Adicionalmente, por decisión de diseño, los parámetros financieros ya no deben editarse en el perfil; el perfil solo servirá como visualizador (read-only) de la última configuración financiera (incluyendo Deuda, que antes no se mostraba). El ingreso de parámetros financieros quedará relegado al momento de crear un nuevo análisis en `NewAnalysisView.tsx`.

## Goals / Non-Goals

**Goals:**
- Conectar `SettingsProfileView.tsx` con el endpoint `PUT /api/v1/auth/usuarios/{id}` para actualizar `nombre` y `email`.
- Actualizar el estado global o localStorage de la sesión actual si la petición PUT tiene éxito (para que el nombre y email cambien en toda la app inmediatamente).
- Refactorizar la sección "Parámetros Financieros" en `SettingsProfileView.tsx` quitando todos los inputs (y el botón de guardado específico de esa sección) y reemplazándolos por una vista premium de "solo lectura" que muestre valores como frecuencia de ahorro, ingreso mensual, objetivo y DEUDA.
- Asegurar que `NewAnalysisView.tsx` solicite desde cero la Información Financiera Base cada vez que se va a crear un análisis.

**Non-Goals:**
- No se implementará el `PUT /api/v1/finanzas/parametros/{usuarioId}` porque el requerimiento actual del usuario indica explícitamente: *"ya no Parámetros financieros, esos datos seguirán siendo visibles en el Perfil pero no se editarán en esta sección"*. Toda la carga de datos será vía `POST /api/v1/finanzas/analizar`.

## Decisions

1. **Llamada a la API en `SettingsProfileView.tsx`**:
   Se creará una función de guardado en el componente para la "Información Personal" que capture los cambios en los estados locales `nombre` y `email`, lance el fetch con método `PUT` hacia `/api/v1/auth/usuarios/${usuarioId}`, maneje estados de loading y muestre feedback (éxito/error).

2. **Sincronización de Sesión**:
   Si el PUT es exitoso, se deberá leer y actualizar el objeto `usuario` en localStorage (o en el contexto si existe) para reflejar los cambios en el Header y Sidebar sin recargar la página.

3. **Modificación Visual de Parámetros Financieros (Settings)**:
   Se reemplazarán las etiquetas `<input>` y `<select>` por elementos textuales estilizados (`div` / `span` con Tailwind) que lean la información provista por el último `reporteAnalisis` o, en su defecto, del perfil (aunque actualmente en el JSON del usuario no vengan, podemos usar los valores del último análisis histórico disponible en caché).

4. **Reinicio de Estado en `NewAnalysisView.tsx`**:
   Se añadirá un `useEffect` que resetee los estados de ingreso, deuda, ahorro, etc. a su valor inicial vacío o cero cada vez que se monte el componente, obligando al usuario a volver a ingresarlos al pedir un nuevo análisis.

## Risks / Trade-offs

- **[Risk]** Si el backend no devuelve los parámetros financieros dentro del objeto de usuario, la vista de Perfil "solo lectura" podría no tener datos que mostrar.
  - **Mitigación**: Alimentaremos la vista de solo lectura de "Parámetros Financieros" extrayendo la información del último análisis que haya hecho el usuario (disponible en el historial). Si no hay historial, se mostrarán como "No configurado".
