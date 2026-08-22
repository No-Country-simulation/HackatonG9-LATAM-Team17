# Capability: clasificacion-transacciones-backend

## ADDED Requirements

### Requirement: Clasificación mediante backend
El sistema DEBE utilizar el endpoint del backend para determinar la categoría de una transacción agregada por el usuario en el formulario.

#### Scenario: Categorización exitosa desde backend
- **WHEN** el usuario hace clic en el botón de "Agregar Transacción" tras escribir monto y descripción
- **THEN** el sistema envía una petición a `/api/v1/finanzas/clasificar` y asigna la categoría devuelta por la IA a la transacción.

#### Scenario: Fallo de conexión o respuesta
- **WHEN** la red falla o el backend responde con un error
- **THEN** el sistema muestra un mensaje de error visual amigable y/o categoriza en fallback local.
