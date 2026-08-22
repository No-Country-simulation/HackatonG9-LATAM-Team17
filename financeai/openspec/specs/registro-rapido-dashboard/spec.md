# Capability: registro-rapido-dashboard

## ADDED Requirements

### Requirement: Ingreso rápido en el Dashboard
El sistema DEBE permitir ingresar transacciones independientes de manera rápida y directa desde la vista del Dashboard.

#### Scenario: Usuario añade una transacción suelta exitosamente
- **WHEN** el usuario ingresa la descripción y el valor en el widget del Dashboard y pulsa "Agregar"
- **THEN** el sistema consulta al clasificador del backend y persiste la transacción de manera local (actualizando las gráficas o métricas pertinentes)

#### Scenario: Estado de carga visible
- **WHEN** el sistema espera la respuesta del clasificador
- **THEN** se muestra un estado de carga visual en el botón de agregar para prevenir envíos duplicados
