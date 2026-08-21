## ADDED Requirements

### Requirement: Modal de Onboarding Inicial
El sistema DEBE mostrar un modal obligatorio inmediatamente después de iniciar sesión si el usuario no tiene configurados sus datos financieros base.

#### Scenario: Usuario sin datos financieros base inicia sesión
- **WHEN** el usuario inicia sesión y su perfil carece de `ingresoMensual` o su valor es <= 0
- **THEN** se renderiza la pantalla de Onboarding.
- **AND** el modal no debe poder cerrarse sin haber completado y enviado los datos mínimos requeridos.

#### Scenario: Envío exitoso de onboarding
- **WHEN** el usuario completa el onboarding y presiona el botón de envío
- **THEN** la aplicación guarda estos datos en el perfil del usuario mediante la función de actualización de perfil
- **AND** se cierra el modal dando acceso libre al Dashboard.
