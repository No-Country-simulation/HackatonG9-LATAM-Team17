## 1. Renombramiento de Estado Local en DashboardView

- [x] 1.1 Renombrar estado `quickDesc` a `descripcionRapida` en todas sus referencias dentro de `DashboardView.tsx`.
- [x] 1.2 Renombrar estado `quickAmount` a `valorRapido`.
- [x] 1.3 Renombrar estado `quickCategory` a `categoriaRapida`.
- [x] 1.4 Renombrar estado `isModelFailed` a `modeloFallo`.
- [x] 1.5 Renombrar estado `manualOverrideActive` a `sobreescrituraManualActiva`.
- [x] 1.6 Renombrar estado `activeTxTab` a `pestanaActivaTx`.
- [x] 1.7 Agregar nuevo estado `clasificandoAPI` (booleano) inicializado en false.

## 2. Preparación de la llamada a la API

- [x] 2.1 Importar la constante `API_BASE_URL` o configurar el endpoint base en `DashboardView.tsx` (o un archivo de utilidades si existe `api.ts`).
- [x] 2.2 Modificar la firma de `handleQuickAdd` para que sea `async` (o crear una función envolvente).

## 3. Integración de POST /api/v1/finanzas/clasificar

- [x] 3.1 Dentro de `handleQuickAdd`, si `!sobreescrituraManualActiva`, iniciar el estado de carga (`setClasificandoAPI(true)`).
- [x] 3.2 Realizar el `fetch` al endpoint `POST /api/v1/finanzas/clasificar` enviando `descripcion` (descripcionRapida) y `valor` (valorRapido).
- [x] 3.3 Procesar la respuesta JSON para extraer la categoría de la clave `resumen_gastos` (la primera o única llave devuelta).
- [x] 3.4 Capturar errores en caso de fallo de la API. Si falla, el `catch` debe utilizar la predicción local de `autoCategorizeDescription(descripcionRapida)` como fallback.
- [x] 3.5 Llamar a `onAddTransaction` con la categoría obtenida (por API o fallback) y actualizar los estados visuales (modeloFallo).
- [x] 3.6 Finalizar estado de carga (`setClasificandoAPI(false)`) y limpiar los inputs.

## 4. Ajustes de UI y UX

- [x] 4.1 Modificar el botón "Agregar" para que, cuando `clasificandoAPI` sea `true`, desactive el botón y cambie su texto/icono (por ejemplo, "Clasificando...").
- [x] 4.2 Probar el flujo completo compilando sin errores de TypeScript y validando visualmente que no haya parpadeos abruptos y las animaciones/colores se mantengan exactos al diseño original.
