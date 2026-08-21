## ADDED Requirements

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
