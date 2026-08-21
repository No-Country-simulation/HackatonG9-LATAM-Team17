# Restricción de Campos Financieros

**Purpose**: TBD

## Requirements

### Requirement: Restricción y redirección de Información Financiera Base
El sistema DEBE evaluar si el usuario cuenta con Información Financiera Base (ej. `ingresoMensual` > 0). Si carece de ella, la sección DEBE ser llenada obligatoriamente en la vista actual. Si ya cuenta con ella, la sección DEBE bloquearse (solo lectura) y proveer una acción de redirección para actualizarla en el Perfil.

#### Scenario: Usuario sin información base previa
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis sin datos base en su perfil.
- **THEN** los campos de Ingreso Mensual y Deudas Totales se muestran vacíos y habilitados.
- **AND** son requeridos para poder generar el análisis.

#### Scenario: Usuario con información base previa
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis con datos base ya configurados.
- **THEN** los campos muestran la información actual pero en estado bloqueado (deshabilitados).
- **AND** se muestra un botón para "Actualizar Información Financiera" que redirige al componente de Configuración de Perfil.

### Requirement: Exigencia de Indicadores Financieros Avanzados
El sistema DEBE requerir que los indicadores avanzados estén llenados y sin datos mockeados.

#### Scenario: Intento de análisis sin indicadores avanzados
- **WHEN** el usuario intenta generar un análisis sin completar campos como `objetivoPresupuesto` o `fondoEmergencia`.
- **THEN** el sistema previene el envío y requiere su llenado explícito.


<!-- Merged from redireccion-onboarding -->
## MODIFIED Requirements

### Requirement: Restricción y redirección de Información Financiera Base
El sistema DEBE evaluar si el usuario cuenta con Información Financiera Base (ej. `ingresoMensual` > 0). Si carece de ella, la sección DEBE ser llenada en el Onboarding Inicial y sujeta a guardado local sin enviar peticiones a la API. Una vez provista (vía Onboarding o de un perfil existente), al navegar a la vista de Nuevo Análisis, esta sección DEBE bloquearse (solo lectura) y proveer una acción de redirección para actualizarla en el Perfil.

#### Scenario: Usuario redirigido desde el Onboarding (con info base temporal)
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis tras ser redirigido desde el Onboarding.
- **THEN** los campos de Ingreso Mensual y Deudas Totales muestran la información recién ingresada pero en estado bloqueado.
- **AND** son requeridos para poder generar el análisis.

#### Scenario: Usuario con información base previa
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis con datos base ya configurados y provenientes del backend.
- **THEN** los campos muestran la información actual pero en estado bloqueado (deshabilitados).
- **AND** se muestra un botón para "Actualizar Información Financiera" que redirige al componente de Configuración de Perfil.


<!-- Merged from onboarding-financiero-base -->
## MODIFIED Requirements

### Requirement: Restricción y redirección de Información Financiera Base
El sistema DEBE evaluar si el usuario cuenta con Información Financiera Base (ej. `ingresoMensual` > 0). Si carece de ella, la sección DEBE llenarse primeramente en el onboarding post-login, y posteriormente en la vista de Nuevo Análisis se mostrará siempre bloqueada (solo lectura) proveyendo una acción de redirección para actualizarla en el Perfil.

#### Scenario: Usuario ingresa a la vista de Nuevo Análisis
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis.
- **THEN** los campos de Ingreso Mensual y Deudas Totales muestran la información actual pero en estado bloqueado (deshabilitados).
- **AND** se muestra un botón para "Actualizar Información Financiera" que redirige al componente de Configuración de Perfil.

### Requirement: Exigencia de Indicadores Financieros Avanzados
El sistema DEBE requerir que los indicadores avanzados estén llenados y sin datos mockeados.

#### Scenario: Intento de análisis sin indicadores avanzados
- **WHEN** el usuario intenta generar un análisis sin completar campos como `objetivoPresupuesto` o `fondoEmergencia`.
- **THEN** el sistema previene el envío y requiere su llenado explícito.


<!-- Merged from eliminar-boton-actualizar-info-financiera -->
## MODIFIED Requirements

### Requirement: Restricción y redirección de Información Financiera Base
El sistema DEBE requerir la carga de la Información Financiera Base en la vista de Nuevo Análisis para que el backend pueda generar exitosamente el reporte. Esta sección DEBE ser siempre editable, independientemente de que el usuario ya cuente con esta información o haya completado el onboarding previamente, para permitir ajustes en el momento del análisis. La redirección al Perfil ha sido removida de este flujo, así como cualquier restricción de solo lectura (campos bloqueados) en esta vista.

#### Scenario: Usuario ingresa a la vista de Nuevo Análisis
- **WHEN** el usuario ingresa a la vista de Nuevo Análisis.
- **THEN** los campos de Ingreso Mensual y Deudas Totales se muestran inicializados con los datos preexistentes del perfil del usuario (provenientes del onboarding o análisis previos), o vacíos si no existen.
- **AND** los campos están habilitados y disponibles para ser editados.
- **AND** no se muestra ningún botón de redirección al Perfil.

#### Scenario: Envío de nuevo análisis al backend
- **WHEN** el usuario completa todos los datos financieros base y avanzados y solicita generar el análisis.
- **THEN** los datos introducidos en los campos editables se envían de forma íntegra en el cuerpo de la petición al endpoint `/api/v1/finanzas/analizar`.



<!-- Merged from conectar-endpoint-perfil -->
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
