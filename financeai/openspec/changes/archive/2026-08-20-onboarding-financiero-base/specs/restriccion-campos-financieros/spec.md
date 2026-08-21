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
