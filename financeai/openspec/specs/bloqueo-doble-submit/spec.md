# bloqueo-doble-submit

## Purpose

Prevenir peticiones recurrentes idénticas concurrentes (doble-submit) en operaciones críticas como la autenticación.

## Requirements

### Requirement: Bloqueo de peticiones recurrentes (Doble-Submit) en Autenticación
El sistema DEBE impedir de forma sincrónica el envío de múltiples peticiones consecutivas idénticas durante el proceso de autenticación.

#### Scenario: Usuario hace doble clic en Iniciar Sesión o Registro
- **WHEN** el usuario hace doble clic o presiona repetidas veces el botón de envío del formulario de login/registro antes de que el estado asíncrono se refleje visualmente.
- **THEN** la primera pulsación procede a enviar la petición POST y actualizar el estado `cargandoApi`.
- **THEN** la segunda pulsación y subsiguientes son ignoradas sincrónicamente en la misma iteración y bloqueadas, evitando así lanzar llamadas HTTP duplicadas.
