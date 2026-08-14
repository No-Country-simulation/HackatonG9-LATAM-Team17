## 1. Type Definitions & Contract Expansion
- [x] 1.1 Update `src/types/finance.ts`: Add `fecha_transaccion: string` to the `TransactionPayload` interface.
- [x] 1.2 Update `src/types/finance.ts`: Expand `AnalysisRequestPayload` with the 5 new V2 numeric fields (`monto_inversion`, `deuda_total`, `objetivo_presupuesto`, `pago_mensual_deuda`, `servicios_suscripcion`, `fondo_emergencia`) in snake_case format.

## 2. Component Logic & Form Expansion
- [x] 2.1 Update `src/components/FormularioAnalisis.tsx`: Introduce specific `useState` string/number hooks for the 5 new financial indicators.
- [x] 2.2 Update `src/components/FormularioAnalisis.tsx`: Inject the UI numeric inputs for these new fields inside a sub-grid of the main layout, ensuring JetBrains Mono styling matches the original design guidelines.
- [x] 2.3 Update `src/components/FormularioAnalisis.tsx`: Modify `handleSubmitAnalysis` to safely parse the new string inputs to floats/ints (defaulting to 0 if empty) and construct the expanded `AnalysisRequestPayload` for the `fetch` dispatch.

## 3. Transaction Timestamping Automation
- [x] 3.1 Update `src/components/SeccionIngresoGastos.tsx`: Modify the logic inside `handleAddClick` to automatically capture `new Date().toISOString().slice(0, 19)` and attach it as `fecha_transaccion` before notifying the parent component.
- [x] 3.2 Update `src/components/MicroTarjetaGasto.tsx`: (Optional) Expose the timestamp on the transaction card UI if necessary, ensuring no table structural regressions occur.

## 4. Verification & Testing
- [x] 4.1 Launch Next.js dev server and verify local end-to-end communication with Spring Boot V2 endpoint (`POST http://localhost:8080/api/v1/finanzas/analizar`) using the expanded payload.
- [x] 4.2 Ensure the JSON Response renders perfectly within `TarjetaDiagnostico` and `TarjetaRecomendacion` without console errors.
