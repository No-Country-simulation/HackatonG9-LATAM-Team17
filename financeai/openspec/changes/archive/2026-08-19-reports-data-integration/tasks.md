## 1. Traducción de Estado al Español
- [x] 1.1 Renombrar `selectedPeriod` -> `periodoSeleccionado`.
- [x] 1.2 Renombrar `isExporting` -> `estaExportando`.
- [x] 1.3 Renombrar `exportSuccess` -> `exportacionExitosa`.
- [x] 1.4 Renombrar `handleExportPDF` -> `manejarExportacionPdf`.

## 2. Inyección de Datos en Distribución de Gastos
- [x] 2.1 Eliminar el array hardcodeado `categories`.
- [x] 2.2 Reemplazar la barra de porcentajes principal iterando de forma segura sobre `report.distribucionCategorias` para calcular el `width` con el `porcentaje` y el `bg` con el `colorHex`.
- [x] 2.3 Reemplazar el listado de leyendas (derecha) mapeando la misma data (`report.distribucionCategorias`).
- [x] 2.4 Reemplazar las etiquetas en la parte inferior iterando sobre `report.distribucionCategorias` para extraer el nombre de la `categoria`.
- [x] 2.5 Añadir condición de fallback por si `report.distribucionCategorias` viene vacío o no está definido.

## 3. Conexión de Datos de Perfil (Métricas Compactas)
- [x] 3.1 Actualizar "Ahorro Total" para usar `report.totalGastado` (o algún cálculo equivalente pertinente si hay data, caso contrario dejar valor estático temporal o fallback).
- [x] 3.2 Actualizar "Obj. Presupuesto" usando `userProfile.budgetGoal`.
- [x] 3.3 Actualizar "Suscripciones" usando `userProfile.subscriptionsCount`.
- [x] 3.4 Actualizar "Fondo Emergencia" usando `userProfile.emergencyFund`.
- [x] 3.5 Aplicar el formato `toLocaleString` para presentar las divisas correctamente.

## 4. Verificación
- [x] 4.1 Confirmar que la UI no se deforme (validar clases de TailwindCSS idénticas en bucles `.map`).
- [x] 4.2 Compilar con TypeScript `npx tsc --noEmit` para validar tipado y propiedades utilizadas.
