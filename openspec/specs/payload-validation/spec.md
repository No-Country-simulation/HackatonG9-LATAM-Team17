## ADDED Requirements

### Requirement: Validación profunda del arreglo de Transacciones
El formulario DEBE abortar la ejecución del análisis si detecta elementos inválidos dentro del arreglo de gastos (transacciones).

#### Scenario: Transacción con descripción vacía
- **WHEN** el usuario hace clic en "Analizar" y alguna transacción tiene `descripcion: ""` o solo espacios
- **THEN** se bloquea la petición `fetch`
- **AND** se establece un error visual indicando: "Asegúrate de que todos tus gastos tengan una descripción..."

#### Scenario: Transacción con valor nulo o cero
- **WHEN** el usuario hace clic en "Analizar" y alguna transacción tiene un `valor <= 0` o nulo
- **THEN** se bloquea la petición `fetch`
- **AND** se establece un error visual indicando: "Asegúrate de que todos tus gastos tengan... un valor mayor a cero."
