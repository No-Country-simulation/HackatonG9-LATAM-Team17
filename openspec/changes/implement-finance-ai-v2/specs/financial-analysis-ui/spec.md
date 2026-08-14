## MODIFIED Requirements

### Requirement: Pre-Submission Financial Computation and Payload Structuring
#### Scenario: Formatting and dispatching analysis payload to Spring Boot V2
- **WHEN** the user submits the form for V2 analysis
- **THEN** the frontend SHALL construct a JSON payload in snake_case containing `ingreso_mensual`, `nivel_endeudamiento`, `frecuencia_ahorro`, `monto_inversion`, `deuda_total`, `objetivo_presupuesto`, `pago_mensual_deuda`, `servicios_suscripcion`, `fondo_emergencia`, and `transacciones` via HTTP POST to `http://localhost:8080/api/v1/finanzas/analizar`

### Requirement: Card-First Expense Transaction Logging
#### Scenario: Timestamp generation for new expense transactions
- **WHEN** the user triggers the add action for a new valid expense transaction
- **THEN** the system SHALL automatically generate an ISO 8601 timestamp and append it to the transaction payload as `fecha_transaccion` without requiring manual user input
