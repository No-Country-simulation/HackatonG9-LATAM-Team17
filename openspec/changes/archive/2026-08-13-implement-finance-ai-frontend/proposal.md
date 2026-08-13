## Why

The current prototype relies on imperative vanilla JavaScript (`app.js`) with legacy markup, which creates a disjointed user experience and lacks scalable architectural structure. Transforming this into a modern Next.js frontend using the official "FinanceAI - The Encouraging Expert" design system creates an engaging, card-first financial evaluation tool that builds user confidence while establishing a robust contract and strict ubiquitous language parity with the Spring Boot analytics service.

## What Changes

- **Light Theme & Official Prototype Layout (UI)**:
  - Abandon dark theme or simple centered layouts. Implement a strict **Light Theme** structured directly after the official prototype in `stitch_financeai_dashboard/code.html`.
  - Feature a persistent white left sidebar (`SideNavBar`), a dedicated `TopAppBar` with search/nav anchors preserved for future versions, and an ultra-light background (`#F8F9FA` / `#FFFFFF`) for the primary canvas and bento grid layout.
- **Ubiquitous Language & Spanish Naming Parity**:
  - All physical files and React component symbols are explicitly named in Spanish to guarantee seamless domain alignment with the Spring Boot backend taxonomy:
    - [src/components/FormularioAnalisis.tsx](file:///c:/ProyectosGitHub/HackatonG9-LATAM-Team17/src/components/FormularioAnalisis.tsx) (Orchestrator and Bento grid container)
    - [src/components/SeccionIngresoGastos.tsx](file:///c:/ProyectosGitHub/HackatonG9-LATAM-Team17/src/components/SeccionIngresoGastos.tsx) (Expense inputs and transaction table)
    - [src/components/MicroTarjetaGasto.tsx](file:///c:/ProyectosGitHub/HackatonG9-LATAM-Team17/src/components/MicroTarjetaGasto.tsx) (Individual expense table rows with semantic category badges)
    - [src/components/TarjetaDiagnostico.tsx](file:///c:/ProyectosGitHub/HackatonG9-LATAM-Team17/src/components/TarjetaDiagnostico.tsx) (AI diagnostic evaluation profile and certainty display)
    - [src/components/TarjetaRecomendacion.tsx](file:///c:/ProyectosGitHub/HackatonG9-LATAM-Team17/src/components/TarjetaRecomendacion.tsx) (Positive growth opportunities and action plan cards)
- **Component-Based React Architecture & Card-First UI**:
  - Implement a declarative Next.js application utilizing native React state (`useState`) without heavy third-party form routing/validation libraries for optimal V1 simplicity.
  - Exclusively support manual expense entry in V1 (excluding bulk CSV import functionality while preserving visual navigation markers for future phases).
  - Display financial diagnostic outcomes (Profile, AI Certainty, Debt Level, Expense Breakdown, and Recommendations) in Level 1 depth semantic cards with ambient shadows (`#FFFFFF` fill, `#E1E3E4` border).
- **Strict Typographic & Visual Tokens**:
  - **Material Symbols Outlined** for intuitive iconography across buttons, tables, and alerts (imported prior to Tailwind rules in `@globals.css`).
  - **Plus Jakarta Sans** for display titles and primary section headers.
  - **Inter** for conversational descriptions, form labels, and general body text.
  - **STRICTLY JetBrains Mono** for all financial values, currency inputs, percentages, and numerical summaries.
  - **Primary Indigo (`#4648d4`)** as the foundational color representing analytical rigor, intelligence, and stability.
  - **Warm Coral (`#fd933d`)** as an interactive accent for action triggers (e.g., add/delete buttons) and to reframe recommendations as empowering growth milestones rather than alarmist warnings.

## Capabilities

### New Capabilities
- `financial-analysis-ui`: Covers the interactive frontend layout in Spanish (`FormularioAnalisis`, `SeccionIngresoGastos`) for logging monthly income, total debt, saving frequency, and manual expense transactions, executing client-side calculation of `nivel_endeudamiento`, and presenting Spring Boot diagnostic evaluations (`TarjetaDiagnostico`, `TarjetaRecomendacion`) within the official Light Theme design system.

### Modified Capabilities
<!-- No existing spec-level requirement changes -->

## Impact

- **Frontend Architecture**: Transitions from standalone DOM scripts to a fully integrated Next.js/React App Router solution styled via Tailwind CSS v4 `@theme inline` configurations.
- **Client-Side Validations**: Enforces structured UI constraints with supportive humanized error messaging before dispatching API requests:
  - Expense description: required, maximum of 25 characters.
  - Expense values and monthly income: strictly positive numbers (> 0).
  - Saving frequency: mandatory option selection.
  - Transaction list: at least one valid manual entry required prior to evaluation analysis.
- **API Payload Contract (Next.js Frontend ↔ Spring Boot Backend)**:
  - Endpoint: `HTTP POST http://localhost:8080/api/v1/finanzas/analizar`
  - **Request JSON Payload**:
    ```json
    {
      "ingreso_mensual": 2500000.0,
      "nivel_endeudamiento": 35,
      "frecuencia_ahorro": "MENSUAL",
      "transacciones": [
        {
          "descripcion": "Supermercado Mercadona",
          "valor": 85400.0
        }
      ]
    }
    ```
  - **Response JSON Payload**:
    ```json
    {
      "perfil_financiero": "En Crecimiento Activo",
      "probabilidad": 0.82,
      "resumen_gastos": {
        "Alimentación": 85400.0
      },
      "recomendaciones": [
        "Optimiza tus transacciones frecuentes: identificamos un margen de ahorro interesante.",
        "Enfoca tu excedente en reducir el nivel de endeudamiento actual paso a paso."
      ]
    }
    ```
