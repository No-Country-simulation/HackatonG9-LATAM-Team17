## 1. Traducción de Nomenclatura del Estado
- [x] 1.1 Renombrar variables base: `monthlyIncome` -> `ingresoMensual`, `totalDebts` -> `deudaTotal`, `savingsFrequency` -> `frecuenciaAhorro`.
- [x] 1.2 Renombrar variables avanzadas: `budgetGoal` -> `objetivoPresupuesto`, `monthlyDebtPayment` -> `pagoMensualDeuda`, `subscriptionsCount` -> `serviciosSuscripcion`, `emergencyFund` -> `fondoEmergencia`. Añadir `montoInversion` con valor inicial `0`.
- [x] 1.3 Renombrar estados de tab y utilería: `inputMode` -> `modoIngreso`, `csvFileName` -> `nombreArchivoCsv`, `isAnalyzing` -> `estaAnalizando`, `analysisError` -> `errorAnalisis`.
- [x] 1.4 Renombrar transacciones: `transactionsList` -> `listaTransacciones`, `txDesc` -> `descTx`, `txAmount` -> `montoTx`, `txCategory` -> `categoriaTx`, `isTxModelFailed` -> `falloModeloTx`, `manualTxOverride` -> `sobrescribirTxManual`.

## 2. Petición POST al Backend de Análisis
- [x] 2.1 Refactorizar `handleGenerateAnalysis` (renombrar a `manejarGenerarAnalisis`) para apuntar a `http://localhost:8080/api/v1/finanzas/analizar`.
- [x] 2.2 Calcular localmente `nivel_endeudamiento` = `Math.round((deudaTotal / ingresoMensual) * 100)` (evitar NaN o Infinity).
- [x] 2.3 Construir el `payload` JSON usando la estructura requerida (incluyendo el valor parseado de `montoInversion` e integrando el array de transacciones con llaves `descripcion`, `valor` y `fecha_transaccion`).

## 3. Mapeo de la Respuesta y Fallback
- [x] 3.1 Leer `datos_analisis` de la respuesta JSON exitosa y mapearlo al objeto `ReporteAnalisis` de la UI (ej. transformar claves de snake_case a camelCase según el tipo `ReporteAnalisis`).
- [x] 3.2 Pasar el objeto mapeado a `onAnalysisComplete`.
- [x] 3.3 Conservar el fallback actual en el bloque `catch` usando las nuevas variables renombradas en español para cuando el servidor falle.

## 4. Ajustes Visuales
- [x] 4.1 Actualizar cualquier referencia de las antiguas variables en los inputs JSX (ej. `value={monthlyIncome}` -> `value={ingresoMensual}`).
- [x] 4.2 Agregar el campo "Monto de Inversión ($)" en la tarjeta de "Indicadores Financieros Avanzados" en la grilla (`grid-cols-1 sm:grid-cols-3` o adaptando a 4).
- [x] 4.3 Verificar compilación exitosa (`npx tsc --noEmit`).
