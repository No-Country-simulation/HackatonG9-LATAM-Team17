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

