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
