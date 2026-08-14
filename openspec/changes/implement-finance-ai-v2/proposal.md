## Why
The backend analysis engine is being updated to V2, expanding its evaluation criteria to provide a more holistic financial assessment. To align with this new API contract (documented functionally in `docs/appV2.js`), the frontend must capture five new specific financial indicators and attach creation timestamps to transaction records, all while preserving the established Card-First UI and Light Theme layout on Next.js.

## What Changes
- Add five new financial input fields (Inversión, Objetivo de Presupuesto, Pago Mensual de Deuda, Suscripciones, Fondo de Emergencia) to the frontend form without breaking the existing Bento Grid layout.
- Automatically generate and append an ISO 8601 timestamp (`fecha_transaccion`) to each expense transaction upon creation.
- Update the Typescript interfaces (`AnalysisRequestPayload`, `TransactionPayload`) to support the new JSON contract in snake_case.
- Update the HTTP POST payload to transmit the newly captured variables to `http://localhost:8080/api/v1/finanzas/analizar`.
- Preserve all existing client-side validations (amount > 0, descriptions <= 25 chars, non-empty transactions) and expand state management for the new React variables.

## Capabilities

### New Capabilities
- (None. We are extending the existing UI capabilities)

### Modified Capabilities
- `financial-analysis-ui`: Modifying form requirements to capture new financial variables (monto_inversion, objetivo_presupuesto, pago_mensual_deuda, servicios_suscripcion, fondo_emergencia), automatically stamp transactions with `fecha_transaccion`, and expand the JSON payload contract for the V2 backend.

## Impact
- **React Components**: `FormularioAnalisis.tsx` (state and payload construction), `SeccionIngresoGastos.tsx` (transaction date generation).
- **TypeScript Types**: `src/types/finance.ts` requires structural expansion for `TransactionPayload` and `AnalysisRequestPayload`.
- **API Contract**: The `POST /api/v1/finanzas/analizar` payload size and structure will change. A regression could occur if the Spring Boot backend is not expecting the V2 format or encounters parsing issues with `fecha_transaccion` or the integer-based `servicios_suscripcion`.
