## Why

Actualmente, al finalizar el modal de Onboarding Inicial, la aplicación intenta realizar un guardado llamando al endpoint `PUT /api/profile`. Sin embargo, el backend de FinanceAI no expone dicho endpoint, ya que todos los datos (perfil y transacciones) deben ser enviados íntegramente al momento de generar el análisis financiero (`POST /api/v1/finanzas/analizar`). Esto produce un error en la solicitud (404), provocando que `App.tsx` capture el error, revierta el estado local, y deje el modal de Onboarding atascado en pantalla. Necesitamos corregir el flujo para que el estado base se actualice solo localmente y se redirija automáticamente al usuario a la vista de Nuevo Análisis, donde podrá completar la información avanzada y enviar correctamente su primer reporte a la API.

## What Changes

- Modificación del callback `onComplete` en el componente `OnboardingModal` dentro de `App.tsx` para que no ejecute una mutación a la API.
- Actualización únicamente del estado de React (`userProfile`) al completar el Onboarding.
- Navegación (redirección) automática a `/analisis/nuevo` inmediatamente después de presionar "Comenzar" en el Onboarding.
- Refactorización de `handleUpdateProfile` (o uso de una función hermana) para soportar esta actualización en solo-lectura / solo-local, sin disparar el fetch que genera la excepción.

## Capabilities

### New Capabilities
- `flujo-onboarding-redireccion`: Define el proceso de actualización del estado local post-onboarding y la redirección automatizada hacia el Nuevo Análisis para completar el flujo requerido por el backend.

### Modified Capabilities
- `restriccion-campos-financieros`: Se adapta para reflejar que la "actualización" del perfil en la primera instancia es exclusivamente a nivel del cliente (local) y culmina al generar el análisis.

## Impact

- `src/App.tsx`: Ajustes significativos en la lógica de guardado y navegación del `OnboardingModal`.
- Flujo de UX (Experiencia del Usuario): El usuario transicionará de forma fluida y sin bloqueos desde el registro -> onboarding -> nuevo análisis.
- El cambio no requiere alteraciones en el backend y elimina una petición huérfana que causaba cuellos de botella y regresiones en el estado.
