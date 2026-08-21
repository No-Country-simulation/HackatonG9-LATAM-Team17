## 1. Actualización de Lógica en App.tsx

- [x] 1.1 Modificar `handleUpdateProfile` en `App.tsx` para aceptar un flag `localOnly?: boolean` o crear una nueva función `handleLocalProfileUpdate` que evite la petición al backend.
- [x] 1.2 En el callback `onComplete` del `<OnboardingModal>` en `App.tsx`, utilizar la actualización puramente local en lugar de la que intenta comunicarse con `/api/profile`.

## 2. Redirección y Flujo de UI

- [x] 2.1 Importar el hook `useNavigate` de `react-router-dom` dentro de `App.tsx` (si aún no está en uso global) o pasarlo al manejador del Onboarding.
- [x] 2.2 Agregar `navigate('/analisis/nuevo')` inmediatamente después de actualizar el estado local en el callback del Onboarding.

## 3. Verificación de Vista Nuevo Análisis

- [x] 3.1 Verificar en `NewAnalysisView.tsx` que, si el `userProfile` ya contiene información base (proveniente de la actualización local), los campos iniciales estén bloqueados.
- [x] 3.2 Asegurar que los botones para enviar form exijan el llenado de los inputs de la Sección Avanzada antes de emitir la petición POST a la API.
