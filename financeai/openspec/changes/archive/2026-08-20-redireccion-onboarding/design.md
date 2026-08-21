## Context

El modal de onboarding pide información financiera base al usuario cuando éste no la tiene configurada. Sin embargo, el diseño original intentaba actualizar el backend usando un endpoint `PUT /api/profile` que no existe en el backend Java. Como el backend requiere estrictamente toda la información (base y avanzada, junto a transacciones) en un solo payload al endpoint `POST /api/v1/finanzas/analizar` para crear el registro financiero inicial, el flujo actual se rompe por un error `404 Not Found`. Se debe manejar el onboarding como una recolección de datos progresiva, almacenada en el estado local de React (en `App.tsx`), y luego hacer una transición automática a la vista de "Nuevo Análisis" para el envío final de datos a la API.

## Goals / Non-Goals

**Goals:**
- Que el usuario pueda completar el Onboarding Inicial (Información Base) y guardar estos datos de forma persistente en el estado de React (`userProfile`).
- Que al completar el onboarding, el usuario sea redirigido de manera automática y fluida a la vista `/analisis/nuevo` para llenar la información avanzada restante.
- Eliminar el llamado fallido al endpoint inexistente `PUT /api/profile` en el flujo de Onboarding para evitar bloqueos (rollbacks de estado).

**Non-Goals:**
- No se crearán ni solicitarán nuevos endpoints en el backend de Java. Todo se resolverá con el endpoint de análisis actual.
- No se restringirá la navegación del usuario si decide salir de `/analisis/nuevo`, aceptando que los datos locales del onboarding se pierdan al recargar la página si no envía el análisis.

## Decisions

- **Modificación de la actualización de estado (`App.tsx`)**: 
  El `OnboardingModal` llamaba a `handleUpdateProfile(datos)` que internamente disparaba el fetch. Cambiaremos esto para que la validación en el `OnboardingModal` simplemente invoque un `setUserProfile` directo, o bien crearemos una función `handleLocalProfileUpdate` dedicada a mutar la memoria en `App.tsx` sin disparar ningún `fetch`.
  
- **Redirección Inmediata (`react-router-dom`)**:
  Dentro del prop `onComplete` del `OnboardingModal` (en `App.tsx`), encadenaremos un llamado a `navigate('/analisis/nuevo')` proveniente del hook `useNavigate`, justo después de actualizar el estado local. De este modo, la UI transiciona de inmediato y bloquea la primera sección del formulario en el `NewAnalysisView`.

- **Experiencia de `NewAnalysisView`**:
  Como el componente `NewAnalysisView.tsx` ya tiene la lógica de auto-completado/bloqueo de campos basada en si las propiedades del `userProfile` (como `ingresoMensual`) existen, no necesita cambios drásticos, solo asegurarse de que exija los indicadores avanzados mediante validaciones HTML5 (`required`) antes del POST final.

## Risks / Trade-offs

- [Riesgo] El usuario llena el Onboarding, es redirigido a `/analisis/nuevo`, pero cierra la pestaña sin terminar el análisis. 
  -> Mitigación: Al volver a entrar, los datos estaban solo en el estado local, por lo que su `ingresoMensual` será `0` o nulo y el Onboarding le volverá a aparecer. Este trade-off es completamente aceptable considerando que el backend es inmutable en este aspecto y previene datos a medias.
