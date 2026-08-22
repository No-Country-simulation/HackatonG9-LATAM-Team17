# Capability: Profile Backend Connection

## Purpose
TBD - Vinculación de las acciones de edición y eliminación de cuenta de usuario con los endpoints reales de Spring Boot v1.

## Requirements

### Requirement: Actualización de Perfil con Backend
El sistema MUST sincronizar los cambios de `nombre` y/o `email` del perfil del usuario con el backend real mediante el endpoint documentado, respetando la actualización parcial.

#### Scenario: Edición de nombre exitosa
- **WHEN** el usuario modifica su nombre a través de la función `handleUpdateProfile`
- **THEN** se invoca una petición HTTP `PUT` a `/api/v1/auth/usuarios/{id}` con el payload JSON `{ "nombre": "Nuevo Nombre" }`
- **AND** al recibir `200 OK`, el estado local `userProfile` se mantiene sincronizado.

#### Scenario: Fallo de edición por email duplicado
- **WHEN** el usuario intenta poner un email que ya está registrado por otro
- **THEN** el backend responde con un error `409`
- **AND** el frontend captura este error a través de `manejarRespuestaError` y notifica globalmente el fallo, revirtiendo o deteniendo la modificación.

#### Scenario: Actualización de métricas financieras exclusivas (Local)
- **WHEN** el sistema invoca `handleUpdateProfile` para actualizar parámetros que no soporta el backend (ej. `ingresoMensual`)
- **THEN** se provee un flag (`localOnly=true` u omitiendo la llamada a la red) para que únicamente se altere la memoria de React, sin hacer el `PUT` que daría error `400`.

### Requirement: Eliminación de Cuenta
El sistema MUST permitir eliminar la cuenta enviando una petición válida al backend.

#### Scenario: Petición de borrado de cuenta
- **WHEN** el usuario confirma la acción de borrar su cuenta y se dispara `handleDeleteAccount`
- **THEN** el frontend invoca `DELETE /api/v1/auth/eliminar?email={email_del_usuario}`
- **AND** maneja los posibles errores (como el `409` por llaves foráneas o historial existente).
