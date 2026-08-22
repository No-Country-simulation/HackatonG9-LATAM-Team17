## 1. Integración en NewAnalysisView

- [x] 1.1 Modificar `handleDescChange` en `NewAnalysisView.tsx` para no invocar `autoCategorizeDescription` si no se desea, o removerlo de ahí temporalmente si el clasificador se llamará al hacer Submit.
- [x] 1.2 Refactorizar `handleAddTx` para que sea una función asíncrona (`async`).
- [x] 1.3 Agregar estado `estaClasificando` (boolean) para deshabilitar botones y mostrar un `Loader2` en el botón de "Agregar".
- [x] 1.4 Dentro de `handleAddTx`, realizar el `fetch` al endpoint `POST /api/v1/finanzas/clasificar` pasando la descripción, el monto, y la fecha de la transacción.
- [x] 1.5 Mapear la clave del objeto `resumen_gastos` devuelto por el backend hacia una categoría compatible con `ExpenseCategory`. Fallback a 'Otros' en caso de error.

## 2. Widget en DashboardView

- [x] 2.1 Diseñar e implementar un mini-formulario "Agregar Transacción" (Descripción y Monto) dentro de `DashboardView.tsx`.
- [x] 2.2 Agregar un estado local (`transaccionesIndependientes`) o extender el estado global `userProfile` (e.g. en `App.tsx`) para almacenar temporalmente transacciones sueltas.
- [x] 2.3 Conectar el botón de guardar del widget al endpoint `POST /api/v1/finanzas/clasificar`, mostrando un estado de carga durante el `fetch`.
- [x] 2.4 Guardar la transacción clasificada en el estado (local o global) y resetear el formulario.

## 3. Integración en HistoryView

- [x] 3.1 Revisar en `HistoryView.tsx` dónde se iteran los análisis retornados por `GET /api/v1/finanzas/historial/{usuarioId}`.
- [x] 3.2 Inyectar o mostrar de alguna manera en la UI de historial las "transacciones independientes" provenientes del estado global si el backend no las devuelve en el endpoint de historial.
