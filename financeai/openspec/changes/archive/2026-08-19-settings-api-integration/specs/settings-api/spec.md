## ADDED Requirements

### Requirement: Eliminación de Cuenta en la Base de Datos
El sistema DEBE procesar de manera definitiva la solicitud de eliminación de perfil mediante el consumo asíncrono del endpoint backend `DELETE /api/v1/auth/eliminar`.

#### Scenario: Eliminación Exitosa Confirmada
- **GIVEN** que el usuario ingresa a la zona de peligro y abre el modal de eliminación.
- **WHEN** digita exactamente la palabra "ELIMINAR" y hace clic en "Eliminar Definitivamente".
- **THEN** la aplicación envía la petición `DELETE` a `http://localhost:8080/api/v1/auth/eliminar?email={email del usuario en sesión}`.
- **THEN** mientras aguarda respuesta, el botón detiene interacciones activando el estado de carga y mostrando "Eliminando...".
- **THEN** si el código es `200`, el sistema cierra con un temporizador el modal de carga, notifica éxito visualmente y dispara la limpieza local del estado de sesión (`onDeleteAccount()`).

#### Scenario: Error al Procesar Baja de Cuenta
- **WHEN** el backend retorna una falla por timeout o un código `404` / `500`.
- **THEN** el sistema lo gestiona en un bloque catch, remueve el estado de carga `estaEliminando` logrando restaurar el estado original del botón.
- **THEN** el modal permanece visible indicando indirecta o programáticamente por log el error, permitiendo al usuario reintentar o cancelar.

### Requirement: Nomenclatura Estricta al Español
- El componente DEBE mantener todos sus literales y variables de React Estado (`useState`) traducidas idiomáticamente (camelCase) tales como: `nombreCompleto`, `correo`, `contrasenaActual`, `ingresoTotal`, `estaEliminando`, etc.
