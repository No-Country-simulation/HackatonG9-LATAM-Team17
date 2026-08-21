## Why

Para generar análisis financieros precisos desde el inicio, es crucial que los usuarios recién registrados ingresen su "Información Financiera Base" antes de intentar interactuar con las funciones principales de la aplicación. Actualmente, si el usuario navega a Nuevo Análisis se topaba con campos, pero la mejor UX dicta que este paso debe ser un proceso de _onboarding_ guiado e ineludible justo después del primer login. De este modo, garantizamos que el sistema cuenta con los datos base requeridos por el backend desde el momento cero, con una pantalla visualmente atractiva ("premium") similar a la de inicio de sesión.

## What Changes

- Creación de un nuevo componente `OnboardingModal` o pantalla interactiva que se desplegará inmediatamente después de que un usuario recién registrado (o que carezca de datos base en su `userProfile`) inicie sesión por primera vez.
- La estética de este nuevo componente heredará las mejores prácticas de UI de `LoginModal` y `SettingsProfileView` (glassmorphism, animaciones fluidas).
- En `NewAnalysisView.tsx`, la sección de "Información Financiera Base" se mostrará estrictamente bloqueada (no editable) si la información ya fue suministrada, permitiendo su modificación únicamente mediante un botón "Actualizar información" que redirigirá al perfil (`SettingsProfileView.tsx`).
- Se mantendrán como obligatorios (required) los campos de "Indicadores Financieros Avanzados" y la sección de "Agregar Transacción" en `NewAnalysisView.tsx`, ya que son esenciales para el endpoint `/api/v1/finanzas/analizar`.
- Limpieza absoluta de mocks en `NewAnalysisView.tsx` (como los strings por defecto '2500000', '875000', etc.) para que en producción el sistema dependa enteramente de los datos ingresados por el usuario.

## Capabilities

### New Capabilities
- `flujo-onboarding-inicial`: Establece el comportamiento y la interfaz que fuerza al usuario a configurar su Información Financiera Base post-registro.

### Modified Capabilities
- `edicion-protegida-perfil`: Extiende la restricción de edición de modo que los datos financieros básicos introducidos en el onboarding solo puedan ser modificados explícitamente en el perfil.
- `restriccion-campos-financieros`: Se actualiza para reflejar que la "Información Financiera Base" en el análisis nuevo proviene estrictamente del onboarding o perfil, requiriendo actualización centralizada.

## Impact

- `src/App.tsx`: Incorporación de la lógica para detectar si el usuario requiere _onboarding_ y mostrar la pantalla modal antes de darle acceso al `Dashboard`.
- `src/components/OnboardingModal.tsx`: Nuevo archivo con la vista premium para el registro de datos base.
- `src/components/NewAnalysisView.tsx`: Consolidación del bloqueo de la info base y exigencias estrictas en transacciones e info avanzada, junto a la eliminación definitiva de cualquier estado mockeado.
