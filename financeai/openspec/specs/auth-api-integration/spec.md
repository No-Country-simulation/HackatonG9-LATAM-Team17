## ADDED Requirements

### Requirement: Autenticación mediante Backend API
El sistema DEBE interactuar con los endpoints `POST /api/v1/auth/login` y `POST /api/v1/auth/registro` para procesar de forma asíncrona la autenticación.

#### Scenario: Iniciar Sesión Exitoso
- **WHEN** el usuario ingresa su correo y contraseña en modo inicio de sesión y envía el formulario
- **THEN** el sistema envía una petición `POST` a `/api/v1/auth/login` con el `email` y `password`
- **THEN** mientras carga, se deshabilita el botón de enviar
- **THEN** tras una respuesta `200 OK`, el sistema invoca la acción exitosa pasando los datos devueltos.

#### Scenario: Registro Exitoso
- **WHEN** el usuario ingresa su nombre, correo y contraseña en modo registro y envía el formulario
- **THEN** el sistema envía una petición `POST` a `/api/v1/auth/registro` con `nombre`, `email` y `password`
- **THEN** mientras carga, se deshabilita el botón de enviar
- **THEN** tras una respuesta `200 OK`, el sistema asume que el registro fue exitoso e invoca la acción exitosa correspondiente en la UI.

#### Scenario: Fallo en Autenticación/Registro
- **WHEN** el servidor retorna un error (ej. `400` o `500`)
- **THEN** el sistema detiene el estado de carga y muestra un mensaje de error visual dentro del modal sin afectar la estética.

### Requirement: Nomenclatura Estricta al Español
El sistema DEBE nombrar todas sus variables internas (estados reactivos, nombres de funciones locales) en español (`camelCase`), desterrando todo vestigio de nombres en inglés como `email`, `password`, o `rememberMe`.
