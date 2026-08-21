# Plan de Tareas

- [x] **1. Crear Utilidad Global**: Crear `src/utils/apiErrors.ts` que exporte la función asíncrona `manejarRespuestaError` y tipos de retorno correspondientes.
- [x] **2. Refactorizar Autenticación**: En `LoginModal.tsx` o `App.tsx` (donde se gestione login y registro), atrapar las llamadas y utilizar la nueva función. Sincronizar el retorno `validationErrors` con campos de entrada (si existen en la UI) o lanzar un mensaje general visual.
- [x] **3. Refactorizar Gestión de Perfil**: En `SettingsProfileView.tsx`, capturar errores en `manejarGuardarBasico`, `manejarGuardarFinanciero`, y `manejarConfirmarEliminarCuenta`. Informar usando un estado de alerta o toast si el código es 409, 404 u otro.
- [x] **4. Refactorizar Análisis IA**: En `NewAnalysisView.tsx`, atrapar errores en `manejarGenerarAnalisis` de forma que los status 502/503 y 404 sean comunicados clara y amigablemente al usuario en la interfaz.
- [x] **5. Test Manuales**: Simular un par de escenarios provocando 400 y 500 en la respuesta desde el backend, validando que el UI no se quiebre.
