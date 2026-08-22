## 1. Actualización de Props y Estado en `App.tsx` y `DashboardView.tsx`

- [x] 1.1 Modificar la interfaz `DashboardViewProps` en `DashboardView.tsx` para aceptar `analysisHistory: ReporteAnalisis[]` y `globalError: string | null`.
- [x] 1.2 En `App.tsx`, pasar el estado `analysisHistory` (que ya existe) como prop al componente `<DashboardView />`.
- [x] 1.3 En `App.tsx`, pasar el estado de error de conexión (ej. `errorGlobal`) hacia `<DashboardView />` en la prop `globalError`.

## 2. Implementación de Fecha Dinámica y Textos Estáticos

- [x] 2.1 En `DashboardView.tsx`, remover la fecha harcodeada "15 de Octubre, 2024" (aprox. línea 197).
- [x] 2.2 Reemplazarla por el código `new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })`.
- [x] 2.3 Buscar el texto "Probabilidad de mejora financiera" y cambiarlo por "Nivel de confianza de IA".

## 3. Lógica del Banner de Sincronización

- [x] 3.1 Eliminar el estado local simulado `showSyncBanner`, `isSyncing` y `syncedSuccess` en `DashboardView.tsx`.
- [x] 3.2 Modificar el renderizado condicional del banner para que lea de `globalError` (si existe, mostrar banner rojo de error).
- [x] 3.3 Implementar un estado temporal en `App.tsx` (ej. `showSuccessSync`) que se active en `true` por 3 segundos justo después de que `handleAnalysisComplete` termine exitosamente, y pasarlo a `DashboardView` para que muestre el banner verde.

## 4. Distribución de Gastos Mensual

- [x] 4.1 En `DashboardView.tsx`, crear un bloque de código (usando `useMemo`) que filtre `analysisHistory` para obtener solo los análisis cuyo mes/año coincida con la fecha actual.
- [x] 4.2 Dentro del mismo `useMemo`, iterar sobre los análisis mensuales para sumar el `totalGastado` agregado y acumular los montos en un diccionario por categoría.
- [x] 4.3 Generar un arreglo `distribucionMensual` con la misma estructura (categoría, monto, porcentaje, colorHex) pero con valores acumulados, calculando el porcentaje respecto al `totalGastado` agregado.
- [x] 4.4 Modificar el bloque `#section-expense-distribution` para mapear `distribucionMensual` en lugar de `report.distribucionCategorias`.

## 5. Recomendaciones del Experto Históricas

- [x] 5.1 En `DashboardView.tsx`, crear un `useEffect` dependiente de `analysisHistory` que recolecte 1 recomendación aleatoria de cada reporte en el historial.
- [x] 5.2 Adjuntar a cada recomendación extraída el id del análisis o su fecha de creación (ej. `fechaAnalisis`).
- [x] 5.3 Guardar esta lista mezclada en el estado local `recommendations`.
- [x] 5.4 Actualizar el mapeo visual de `#section-expert-recommendations` para incluir un subtítulo con la fecha del análisis al que pertenece la recomendación.

## 6. Modal de Historial (AnalysisTimelineModal)

- [x] 6.1 Crear un nuevo componente `AnalysisTimelineModal.tsx` que reciba `history: ReporteAnalisis[]`, `isOpen: boolean`, `onClose: () => void` y `onSelectAnalysis: (r: ReporteAnalisis) => void`.
- [x] 6.2 Implementar en `AnalysisTimelineModal.tsx` una interfaz tipo lista cronológica mostrando la fecha y puntaje de salud de cada análisis.
- [x] 6.3 En `DashboardView.tsx`, cambiar el comportamiento del botón "Ver reporte completo" para que abra `AnalysisTimelineModal`.
- [x] 6.4 Conectar `onSelectAnalysis` del nuevo modal para que invoque el flujo original que abre el `AnalysisDetailModal` con el reporte seleccionado.
