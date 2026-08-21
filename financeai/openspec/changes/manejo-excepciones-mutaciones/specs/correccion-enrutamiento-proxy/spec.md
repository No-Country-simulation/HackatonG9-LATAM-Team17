## ADDED Requirements

### Requirement: Enrutamiento mediante Proxy Relativo
El sistema SHALL utilizar de forma exclusiva URLs relativas para acceder a la API (por ejemplo `/api/v1/...`) para asegurar compatibilidad de CORS y correcto enrutamiento del proxy de Vite. No se deben utilizar URLs absolutas que especifiquen localhost o puertos de desarrollo.

#### Scenario: Petición a Clasificar en Dashboard
- **WHEN** el componente Dashboard envía una descripción de transacción para ser auto-clasificada
- **THEN** la solicitud HTTP se dirige a `/api/v1/finanzas/clasificar` en vez de incluir el dominio y puerto absoluto

#### Scenario: Petición a Historial
- **WHEN** el componente HistoryView solicita el listado de análisis previos
- **THEN** la solicitud se envía a `/api/v1/finanzas/historial` en lugar de `http://localhost:8080/api/v1/finanzas/historial`
