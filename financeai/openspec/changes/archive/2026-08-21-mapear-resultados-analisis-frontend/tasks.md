## 1. Mapeo de Respuesta en `NewAnalysisView.tsx`

- [x] 1.1 Remover la condicional `if (data.datos_analisis)` que actualmente engloba la lógica de creación del reporte.
- [x] 1.2 Calcular `totalGastado` iterando sobre los values de `data.resumen_gastos` y sumándolos. Si `resumen_gastos` no existe, usar 0.
- [x] 1.3 Mapear `data.probabilidad` a `puntajeSalud` (multiplicar por 100 y redondear si es necesario).
- [x] 1.4 Mapear `data.perfil_financiero` a `estadoSalud`. Usar aserción temporal si es necesario para empatar con `HealthStatus`.
- [x] 1.5 Crear `distribucionCategorias` mapeando el objeto `resumen_gastos`. Calcular el porcentaje de cada categoría dividiendo su monto entre `totalGastado`. Asignar colores por defecto de la interfaz.
- [x] 1.6 Mapear el array de strings `data.recomendaciones` a un arreglo de objetos tipo `Recomendacion` (asignar un ID, el texto como descripción, un título genérico como "Recomendación X" o usar partes del texto, y un estado por defecto como 'warning' o 'info').
- [x] 1.7 Construir y pasar el objeto `ReporteAnalisis` reconstruido a `onAnalysisComplete(report)`.

## 2. Pruebas y Validación Manual

- [x] 2.1 Ejecutar la aplicación, ingresar a la vista de "Nuevo Análisis" y procesar un reporte nuevo.
- [x] 2.2 Verificar que el modal de resultados se abra y muestre los datos mapeados (especialmente las categorías de gasto, el puntaje de salud y las recomendaciones con texto visible).
