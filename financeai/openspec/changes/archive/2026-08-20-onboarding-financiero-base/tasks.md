## 1. Creación del componente OnboardingModal

- [x] 1.1 Crear el archivo `src/components/OnboardingModal.tsx`.
- [x] 1.2 Implementar la UI del modal asegurando estética "premium" (fondos semitransparentes, bordes redondeados y uso de colores de la paleta).
- [x] 1.3 Incluir un formulario con los campos: `ingresoMensual`, `deudaTotal` y `frecuenciaAhorro`.
- [x] 1.4 Validar que los campos numéricos sean `required` y tengan `min="0"`.
- [x] 1.5 Emitir mediante un callback `onComplete` el payload correspondiente una vez enviados los datos correctamente.

## 2. Integración de Onboarding en la Aplicación

- [x] 2.1 Importar y renderizar `<OnboardingModal />` en `src/App.tsx`.
- [x] 2.2 Crear la condición de renderizado `necesitaOnboarding` basándose en la ausencia de `userProfile.ingresoMensual` o si su valor es `<= 0`.
- [x] 2.3 Conectar el callback `onComplete` al manejador `handleUpdateProfile` en `App.tsx` para persistir la información.

## 3. Revisión cruzada en NewAnalysisView (Mantenimiento)

- [x] 3.1 Revisar que `NewAnalysisView.tsx` mantenga la lógica previamente implementada: los inputs de "Información Financiera Base" se deben mostrar bloqueados (`disabled`) porque ahora se asegura de que o bien llegan llenos por el onboarding, o el usuario será redirigido.
- [x] 3.2 Verificar que el botón "Actualizar Información Financiera" siga visible para redirigir al perfil.
- [x] 3.3 Confirmar que los "Indicadores Financieros Avanzados" y "Agregar Transacción" mantengan la condición `required` impuesta previamente, sin mocks por defecto.
