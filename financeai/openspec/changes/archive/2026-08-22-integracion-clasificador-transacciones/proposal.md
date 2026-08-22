## Why

Actualmente, el componente `NewAnalysisView` realiza una clasificación simulada en el frontend (`autoCategorizeDescription`) para las transacciones agregadas. Sin embargo, existe un modelo avanzado en el backend expuesto a través de `POST /api/v1/finanzas/clasificar` que retorna probabilidades y clasificaciones reales por el motor de IA. Además, falta una vía rápida para registrar "transacciones independientes" directamente desde el Panel (`DashboardView`), lo cual impide al usuario alimentar el historial de manera ágil sin pasar por todo el flujo de un análisis completo.

## What Changes

- Modificación de la función `handleDescChange` y `handleAddTx` en `NewAnalysisView.tsx` para hacer fetch al endpoint `/api/v1/finanzas/clasificar` en lugar de simularlo.
- Creación de un widget "Registro Rápido de Transacción" en `DashboardView.tsx` para agregar transacciones sueltas.
- Integración de este registro en `HistoryView.tsx` para que, en adición a los análisis globales, se reflejen (si aplica o se pueden inyectar) estos nuevos movimientos en el historial provisto por `GET /api/v1/finanzas/historial/{usuarioId}`.
- Manejo de excepciones visuales cuando el clasificador falle o tarde en responder, usando spinners (`Loader2`) y alertas (glassmorphism UI).

## Capabilities

### New Capabilities
- `clasificacion-transacciones-backend`: Uso del motor Python del backend para inferir categorías de transacciones individuales en vez de depender de lógica frontend hardcodeada.
- `registro-rapido-dashboard`: Interfaz en el Dashboard para el registro ágil y directo de transacciones.

### Modified Capabilities
- `historial-analisis`: Se actualizará para presentar cómo las transacciones sueltas interactúan o se muestran dentro del historial del usuario (en caso de que el backend soporte la persistencia aislada de estas, de lo contrario se documentará el mock frontend).

## Impact

- `src/components/NewAnalysisView.tsx`: Cambios mayores en la sección "Agregar Transacción" (líneas 52-117 aprox).
- `src/components/DashboardView.tsx`: Inserción de un nuevo componente visual/widget para el ingreso rápido.
- `src/components/HistoryView.tsx`: Posible actualización para consumir el historial consolidado.
- Dependencias de API: Integración obligatoria de `POST /api/v1/finanzas/clasificar`.
