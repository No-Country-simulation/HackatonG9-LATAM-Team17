## Why

El texto actual en el componente `NewAnalysisView.tsx` ("¡Ya casi! Agregar entradas manuales mantiene tu historia precisa...") asume erróneamente que los gastos se están agregando directamente al historial contable del usuario. Sin embargo, tras la reciente refactorización de la lógica del frontend, los gastos actúan realmente como un "borrador temporal" o "carrito" que se envía en bloque a la inteligencia artificial para generar un reporte integral. Es necesario que el texto de motivación refleje este comportamiento de agrupación para no confundir al usuario sobre cómo funciona la aplicación.

## What Changes

- Modificación de la tarjeta motivacional ("Sidecard 2") en `NewAnalysisView.tsx`.
- Reemplazo del texto actual por uno que promueva la idea de enviar los gastos a la IA para su análisis y categorización conjunta.
- Mantenimiento del estilo premium del componente y la mascota animada existente.

## Capabilities

### New Capabilities
- `adaptacion-copy-analisis`: Adaptación de los textos informativos en las vistas de análisis para reflejar con precisión el flujo de datos real del frontend.

### Modified Capabilities

## Impact

- Modificación exclusiva de la interfaz gráfica (`NewAnalysisView.tsx`).
- No afecta las llamadas API.
- Refuerza el entendimiento del usuario sobre el modelo mental de "Bandeja de Transacciones".
