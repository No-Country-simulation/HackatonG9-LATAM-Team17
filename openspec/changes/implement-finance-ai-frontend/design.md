## Context

The legacy financial analysis interface prototype (`app.js`) currently implements imperative DOM manipulation, dense tabular HTML (`<table>`), and global JavaScript variables. We are transitioning this into a modern, responsive Next.js application that enforces the **FinanceAI ("The Encouraging Expert")** design system, guarantees robust client-side financial computation before communicating with the Spring Boot analytics backend at `http://localhost:8080/api/v1/finanzas/analizar`, and delivers an empowering user experience.

## Goals / Non-Goals

**Goals:**
- **Card-First Architecture**: Replace traditional HTML data tables with interactive Micro-cards for individual expense logging and Semantic Cards for financial diagnostic breakdowns.
- **Strict Typographic Hierarchy**: Implement Google Fonts (Plus Jakarta Sans for titles, Inter for conversational and body copy, and strictly JetBrains Mono for all numeric values, inputs, percentages, and financial outputs).
- **Positive & Empowering Tone**: Adopt "The Encouraging Expert" UX philosophy. Utilize **Primary Indigo** as the bedrock color for trust and diagnostic stability, and **Warm Coral** exclusively for active call-to-actions, micro-card deletion icon controls, and growth-oriented recommendation highlights rather than punitive danger warnings.
- **Client-Side Preprocessing & Validations**: Implement lightweight traditional conditional checking (`if` statements) and calculate `nivel_endeudamiento` directly inside native React components before dispatching the strict JSON payload to Spring Boot.

**Non-Goals:**
- Introducing external schema validation libraries (like Zod) or form management frameworks (like React Hook Form or Formik) during V1, preserving speed and execution transparency.
- Modifying the Spring Boot API contract or business logic on the server side; the Next.js frontend strictly consumes and conforms to the existing REST schema.
- Creating persistent client-side data storage outside of current in-memory React state (`useState`), as sessions are currently evaluated per analysis submission.

## Decisions

### 1. State Management & Form Validation via Native React State
- **Decision**: Manage form controls, expense list arrays (`listaGastos`), and error visibility using standard functional React state (`useState`), using direct conditional blocks (`if (descripcion.length > 25) ...`, `if (valor <= 0) ...`) prior to calculation and network dispatch.
- **Rationale**: Keeps V1 implementation nimble, zero-dependency, and directly analogous to the proven business logic verified in the prototype (`app.js`), reducing onboarding friction and enabling immediate integration testing against the REST backend.
- **Alternatives Considered**: Using React Hook Form + Zod was evaluated but postponed for future iterations to avoid excess boilerplate and serialization overhead during rapid prototype-to-Next.js testing.

### 2. Card-First Component Strategy Over Tabular Layouts
- **Decision**: Architect dedicated React components: `<ExpenseMicroCard />` for expense items and `<DiagnosticCard />` / `<RecommendationCard />` for analytical output.
- **Rationale**: Dense HTML tables create high visual friction, particularly on mobile viewports. Micro-cards with smooth DOM entrance transitions elevate the perceived quality of the application and emphasize critical numerical data using JetBrains Mono styling.
- **Alternatives Considered**: Using responsive CSS Grid tables or data grids was dismissed because tabular layouts inherently conflict with the project's Card-First core philosophy.

### 3. Color Psychology & Non-Punitive Feedback Design
- **Decision**: Avoid standard traffic-light alert colors (e.g., bright hazard red for high debt ratios). Instead, apply **Warm Coral** to highlight action items and recommendations as proactive growth opportunities, anchored against a calm, expert **Primary Indigo** background theme.
- **Rationale**: Financial tools frequently induce stress or alienation through punitive visual cues. Framing recommendations with Warm Coral invites user engagement and reinforces "The Encouraging Expert" brand persona.
- **Alternatives Considered**: Traditional green/yellow/red indicators for financial health scores were explicitly rejected to preserve emotional supportiveness and visual elegance.

## Risks / Trade-offs

- **[Risk: Manual conditional validation scaling]** As forms grow more complex in V2+, traditional `if`-based validation logic may become verbose in component code.
  - *Mitigation*: Encapsulate form verification logic inside custom validation helper functions or dedicated domain utilities so components remain clean and easy to refactor later into schema validators if needed.
- **[Risk: Cross-Origin Resource Sharing (CORS) during development]** Communicating directly between Next.js dev server (`http://localhost:3000`) and Spring Boot (`http://localhost:8080`) may trigger browser CORS blocks if Spring Boot isn't configured for origin allowances.
  - *Mitigation*: Configure Next.js API rewrites (`next.config.mjs`) to route requests seamlessly (e.g., `/api/proxy/finanzas/analizar`), or verify backend Spring `@CrossOrigin` configuration.
