## Why

Actualmente, el componente `NewAnalysisView.tsx` inicializa los parámetros financieros con datos predeterminados (mocks) que son inadecuados para producción. El backend exige explícitamente ciertos campos para realizar un nuevo análisis. Necesitamos asegurarnos de que el usuario, en su primer uso, deba llenar de manera obligatoria la "Información Financiera Base", mientras que para usuarios recurrentes esta sección se vuelva de solo lectura, forzando la redirección al Perfil de Usuario para ser editada. Además, los "Indicadores Financieros Avanzados" también deben tratarse de forma obligatoria y dinámica, sin mock-data.

## What Changes

- Eliminación completa de datos falsos (mocks) tanto en los estados iniciales (`useState`) de `NewAnalysisView.tsx` como en el fallback importador de CSV.
- Separación de la interfaz "Información Financiera Base" en dos modos:
  - **Usuario Nuevo**: Inputs habilitados (vacíos) que son obligatorios para enviar el formulario.
  - **Usuario Recurrente**: Valores de solo lectura y renderizado de un botón "Actualizar Información Financiera" que redirige a `SettingsProfileView.tsx`.
- Modificación de los inputs de "Indicadores Financieros Avanzados" para que no tengan mocks predeterminados y sean requeridos antes del submit.
- Integración estricta con las exigencias obligatorias del backend según documentado en `API_BACKEND_ENDPOINTS.md`.

## Capabilities

### New Capabilities
- `restriccion-campos-financieros`: Maneja la condición que determina si el usuario puede ingresar datos financieros básicos desde la pantalla de Análisis, o si por el contrario, los visualiza en modo lectura y debe ser redirigido a Configuración.

### Modified Capabilities
- 

## Impact

- `src/components/NewAnalysisView.tsx`: Cambios significativos de UX y limpieza de código (eliminación de estados por defecto). Redirección posible a través de React Router o hooks.
- UX general: Al usuario se le presentará un flujo más seguro y coherente con un entorno de producción, limitando las acciones repetitivas y evitando el llenado de parámetros cruciales desde la vista equivocada.
