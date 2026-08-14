# transaction-crud-ui

## Purpose
Gestionar la interfaz de usuario para las operaciones de transacciones, manteniéndola sincronizada con el backend mediante peticiones directas y asegurando que las funciones de análisis macro queden desacopladas del estado detallado de cada gasto.

## Requirements

### Requirement: CRUD de Transacciones en el Cliente
La aplicación cliente DEBE gestionar el ciclo de vida de los gastos interactuando con el endpoint `/api/v1/transacciones`. (Todo apuntado al mock `USR-1001`).

#### Scenario: Carga Inicial (Lectura)
- **WHEN** el usuario visualiza el formulario
- **THEN** el sistema lanza un `GET /api/v1/transacciones/usuario/USR-1001`
- **AND** pobla la lista visual de gastos con la respuesta del servidor.

#### Scenario: Creación (Escritura)
- **WHEN** el usuario añade una nueva descripción y un monto y hace clic en agregar
- **THEN** el sistema lanza un `POST /api/v1/transacciones/usuario/USR-1001`
- **AND** solo añade el registro visual a la UI si el servidor retorna éxito.

#### Scenario: Eliminación (Borrado)
- **WHEN** el usuario hace clic en el botón de eliminar de una tarjeta de gasto
- **THEN** el sistema lanza un `DELETE /api/v1/transacciones/{idGasto}`
- **AND** retira el gasto de la pantalla tras el éxito HTTP.

### Requirement: Simplificación de Payload Analítico
- **WHEN** el usuario solicita procesar el análisis de su perfil
- **THEN** el objeto JSON despachado a `POST /api/v1/analisis/perfil/USR-1001` NO debe incluir la propiedad `transacciones`.
