## ADDED Requirements

### Requirement: Sincronización de Endpoint de Análisis
El sistema frontend DEBE enviar la petición de análisis financiero al endpoint correcto del usuario.

#### Scenario: Petición Exitosa
- **WHEN** el usuario hace clic en el botón "Generar Análisis" con un formulario válido
- **THEN** la aplicación dispara un POST a `http://localhost:8080/api/v1/analisis/perfil/USR-1001`
- **AND** el payload del cuerpo (`body`) coincide estructuralmente con `AnalisisInputDTO`.

#### Scenario: Manejo de Caída del Servidor (Server Down)
- **WHEN** el servicio de Spring Boot no se encuentra activo
- **THEN** el bloque `catch` de la función constructora intercepta el error
- **AND** renderiza el banner rojo indicando "No logramos conectar..." sin purgar los datos ingresados por el usuario.
