## ADDED Requirements

### Requirement: Card-First Expense Transaction Logging
The frontend SHALL present expense management as an interactive list of Micro-cards rather than tabular HTML rows, formatting transaction descriptions in Inter font and financial amounts strictly in JetBrains Mono font. Each micro-card MUST integrate a dedicated delete action stylized with a Warm Coral visual accent.

#### Scenario: Successfully adding a valid expense transaction
- **WHEN** the user inputs a valid expense description (non-empty, 25 characters or fewer) and a strictly positive financial value (> 0), then triggers the add action
- **THEN** a new Micro-card displaying the description in Inter and the amount in JetBrains Mono SHALL append to the expense list with a smooth visual transition

#### Scenario: Deleting an existing expense transaction micro-card
- **WHEN** the user interacts with the Warm Coral delete action on a specific transaction Micro-card
- **THEN** that specific micro-card SHALL be removed from the active React state and visually disappear from the interface

### Requirement: Client-Side Input Validations
The application SHALL perform immediate, lightweight client-side input verifications using conditional rules prior to state updates or backend communication, presenting clear feedback without punitive visual alerting.

#### Scenario: Attempting to add an expense with excessive description length
- **WHEN** the user attempts to add a transaction with a description exceeding 25 characters
- **THEN** the system SHALL block the addition and present a supportive validation guidance message

#### Scenario: Attempting to add an expense with zero or negative financial value
- **WHEN** the user attempts to add an expense with a zero, negative, or non-numeric amount
- **THEN** the system SHALL reject the entry and display an encouraging validation notification

#### Scenario: Attempting analysis submission without logged expenses
- **WHEN** the user triggers the financial analysis form submission while the transaction list is empty
- **THEN** the system SHALL halt submission and request that at least one expense be recorded

### Requirement: Pre-Submission Financial Computation and Payload Structuring
Upon valid form submission, the frontend SHALL compute the debt percentage ratio directly on the client side (`round((valorDeuda / ingresoMensual) * 100)`) and construct a structured JSON payload conforming strictly to the Spring Boot REST API contract before issuing an HTTP POST request to `http://localhost:8080/api/v1/finanzas/analizar`.

#### Scenario: Formatting and dispatching analysis payload to Spring Boot
- **WHEN** the user submits a valid form containing monthly income, total debt, saving frequency, and populated expense micro-cards
- **THEN** the frontend SHALL calculate `nivel_endeudamiento` and transmit a JSON payload containing `ingreso_mensual`, `nivel_endeudamiento`, `frecuencia_ahorro`, and `transacciones` via HTTP POST to the analysis endpoint

### Requirement: "The Encouraging Expert" Diagnostic Dashboard Display
The interface SHALL display analysis outcomes from the Spring Boot service within semantic, soft-bordered cards utilizing Primary Indigo as the primary theme for trust and analytical confidence, and Warm Coral accents to highlight growth-oriented user action items. All percentages, probabilities, and currency amounts MUST render exclusively in JetBrains Mono font.

#### Scenario: Rendering diagnostic profile and AI analysis certainty
- **WHEN** the backend returns a successful financial profile and evaluation probability (e.g., 0.82)
- **THEN** the interface SHALL render the financial profile title in Plus Jakarta Sans font and display the certainty ratio as a rounded percentage (e.g., 82%) formatted strictly in JetBrains Mono inside a semantic diagnostic card

#### Scenario: Presenting non-punitive financial growth recommendations
- **WHEN** the analysis result includes actionable recommendations for debt management or budget optimization
- **THEN** the system SHALL display each recommendation in dedicated growth cards accentuated with Warm Coral styling, framing the guidance as positive action items without alarming warning aesthetics
