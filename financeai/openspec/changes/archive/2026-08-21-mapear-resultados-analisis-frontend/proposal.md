## Why

Actualmente, tras generar un análisis financiero en `NewAnalysisView.tsx` enviando los datos al backend (endpoint `/api/v1/finanzas/analizar`), la interfaz no muestra los resultados esperados. Esto se debe a una incompatibilidad entre la estructura de respuesta esperada por el frontend (un objeto `datos_analisis` con campos específicos) y lo que realmente devuelve el backend (campos sueltos como `perfil_financiero`, `probabilidad`, `resumen_gastos` y un array de strings para `recomendaciones`). Es necesario mapear correctamente esta respuesta para que el usuario pueda visualizar el reporte generado sin alterar el backend, garantizando que el diseño y experiencia de usuario no se vean afectados.

## What Changes

- Modificar la función que maneja el envío de datos en `src/components/NewAnalysisView.tsx`.
- Mapear `perfil_financiero` a `estadoSalud` (convertir a tipo `HealthStatus`).
- Mapear `probabilidad` a `puntajeSalud` multiplicándolo por 100.
- Calcular `totalGastado` a partir de la suma de los valores en el objeto `resumen_gastos`.
- Convertir `resumen_gastos` (mapa de categorías y montos) a un arreglo compatible con `distribucionCategorias`, incluyendo cálculos de porcentajes.
- Transformar el arreglo de strings `recomendaciones` a un arreglo de objetos `Recomendacion` con títulos, descripciones y tipos de impacto generados o extraídos inteligentemente, ya que el backend no proporciona esta estructura detallada.

## Capabilities

### New Capabilities
- No se introducen nuevas capacidades de negocio, solo adaptaciones de modelo de datos.

### Modified Capabilities
- `reports-mapping`: Mapeo y transformación de los datos de reportes del backend para ser mostrados en los modales y vistas del frontend.

## Impact

- `src/components/NewAnalysisView.tsx`: Refactorización en el manejo de respuesta de la API `/api/v1/finanzas/analizar`.
- No afecta APIs del backend, dependencias o tipos base (`types.ts`), ya que la transformación ocurre localmente en el componente o un utilitario.
