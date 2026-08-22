## Why

Actualmente, el "Registro de Transacciones" funciona como un borrador temporal en memoria (React state) que permite acumular gastos para generar un análisis. Sin embargo, al estar únicamente en RAM, el usuario pierde todas sus transacciones ingresadas si recarga la página o cierra accidentalmente la pestaña antes de enviar el análisis. Se requiere una solución que brinde persistencia local como "salvavidas" para garantizar una mejor experiencia y no perder datos no guardados, y además aclarar en la UI su verdadero propósito temporal.

## What Changes

- Sincronización del estado de `transactions` con `localStorage` en `App.tsx` para evitar pérdida de datos ante recargas.
- Vaciado de las transacciones (en estado y localStorage) automáticamente cuando se genera exitosamente un análisis y se recibe un 200 OK del backend.
- Modificación del copy en el Dashboard (específicamente en la UI de transacciones) de "Registro de Transacciones" a "Nuevos Gastos (Pendientes de Análisis)" u otro texto similar que denote su condición temporal.

## Capabilities

### New Capabilities
- `persistencia-local-transacciones`: Capacidad de guardar transacciones localmente y vaciarlas al ejecutar un análisis completo.

### Modified Capabilities
- Ninguna

## Impact

- `src/App.tsx`: Modificación del hook de `transactions` para que use `localStorage`. Integración en la lógica de `handleAnalyze` para borrar las transacciones locales tras éxito.
- `src/components/DashboardView.tsx`: Actualización de textos en la UI para reflejar el estado temporal del carrito.
- Flujo de usuario: El usuario ya no perderá los datos ingresados al recargar y entenderá claramente que debe presionar el botón de análisis para guardar permanentemente en su historial.
