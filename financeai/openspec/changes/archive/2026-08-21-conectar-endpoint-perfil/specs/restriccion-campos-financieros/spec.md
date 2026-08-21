## ADDED Requirements

### Requirement: Edición de Información Personal
El sistema SHALL permitir al usuario actualizar su `nombre` y `email` desde la vista de Ajustes y Perfil a través de una petición HTTP PUT.

#### Scenario: Guardado exitoso de información personal
- **WHEN** el usuario ingresa un nuevo nombre o email y hace clic en guardar
- **THEN** el sistema envía una petición PUT al endpoint `/api/v1/auth/usuarios/{id}` y, tras confirmar el éxito, actualiza la información en la sesión global (ej. Header, Sidebar).

## MODIFIED Requirements

### Requirement: Restricción y redirección de Información Financiera Base
El sistema SHALL requerir que la Información Financiera Base y Avanzada se ingrese *cada vez* que se quiera generar un nuevo análisis en la vista de Nuevo Análisis (dejando de ser campos de solo lectura). Por otro lado, en la vista de Configuración de Perfil (`SettingsProfileView`), los Parámetros Financieros SHALL ser de solo lectura y no permitirán edición.

#### Scenario: Visualización estática en el Perfil
- **WHEN** el usuario ingresa a la vista de Configuración de Perfil
- **THEN** la sección de Parámetros Financieros muestra la información del último análisis (incluyendo la Deuda Total) en componentes de solo lectura, sin inputs ni botones de guardado.

#### Scenario: Ingreso de datos en Nuevo Análisis
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis
- **THEN** los campos de Información Financiera (Base y Avanzada) se presentan vacíos o reseteados y listos para ser llenados por el usuario para ese análisis específico.
