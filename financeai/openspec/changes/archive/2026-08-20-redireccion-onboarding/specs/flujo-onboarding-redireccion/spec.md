## ADDED Requirements

### Requirement: Guardado local de Onboarding y Redirección
El sistema DEBE actualizar el estado local del perfil del usuario (sin invocar APIs) al completar el formulario de Onboarding Inicial, e inmediatamente redirigirlo a la vista de Nuevo Análisis para forzar la compleción de los campos avanzados requeridos por el backend.

#### Scenario: Onboarding Inicial Completado
- **WHEN** el usuario completa el Onboarding y presiona "Comenzar".
- **THEN** el sistema actualiza la memoria local con los datos base provistos.
- **AND** redirige automáticamente al usuario a `/analisis/nuevo`.
