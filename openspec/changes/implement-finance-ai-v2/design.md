## Context
The application is migrating to the V2 FinanceAI engine. The backend will now expect a broader set of financial indicators (investment, emergency fund, subscriptions, etc.) and a timestamp on each transaction to compute advanced financial profiles. The frontend must expand its data capture and validation mechanisms without cluttering the main `FormularioAnalisis` or breaking the Light Theme Bento Grid.

## Goals / Non-Goals

**Goals:**
- Extend the React form state to capture 5 new inputs natively using TypeScript.
- Automatically generate the ISO 8601 `fecha_transaccion` in `SeccionIngresoGastos` when a new expense is logged.
- Update the HTTP POST request payload matching the V2 API schema in snake_case.

**Non-Goals:**
- Modifying the visual design, colors, typography, or existing component architecture significantly.
- Parsing CSV files or connecting to real bank APIs.
- Replacing Next.js/React standard state hooks with third-party libraries (e.g., Redux, React Hook Form).

## Decisions
- **Decision 1: Form Expansion**: We will insert the 5 new numeric inputs into the primary form grid in `FormularioAnalisis.tsx`. To maintain visual coherence, they will be styled consistently with the existing JetBrains Mono financial inputs.
- **Decision 2: Transaction Timestamping**: `fecha_transaccion` will be generated implicitly using `new Date().toISOString().slice(0, 19)` at the exact moment the user clicks "Agregar Transacción" rather than requiring user manual entry, preserving UX speed.
- **Decision 3: Payload Transformation**: The React form states (camelCase) will be explicitly mapped to the `AnalysisRequestPayload` properties (snake_case) right before the `fetch` dispatch. Missing numeric inputs will default to `0`.

## Risks / Trade-offs
- **Risk**: Backend Deserialization Failure if `fecha_transaccion` format is incompatible.
  **Mitigation**: We will ensure the timestamp strictly matches the ISO format expected by Spring Boot `LocalDateTime`.
- **Risk**: Form UI Clutter.
  **Mitigation**: We will arrange the new inputs in a logical sub-grid inside the primary 8-column layout.
