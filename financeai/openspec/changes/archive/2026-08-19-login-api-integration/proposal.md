## Why

El componente `LoginModal.tsx` maneja el formulario de autenticación, pero actualmente simula el inicio de sesión invocando `onLoginSuccess` directamente en el evento _submit_. Según la documentación en `docs/API_BACKEND_ENDPOINTS.md`, los endpoints para autenticación son `POST /api/v1/auth/login` y `POST /api/v1/auth/registro`. Se requiere integrar estas llamadas a la API respetando el diseño actual de la UI.
Adicionalmente, el estado local (`isRegister`, `email`, `name`, `password`, `showPassword`, `rememberMe`) está en inglés, violando la regla del proyecto de utilizar variables estrictamente en español en `camelCase`.

## User Review Required

**⚠️ ADVERTENCIA: Cambio de Nomenclatura**
Siguiendo las reglas del proyecto, propongo cambiar los siguientes estados internos de `LoginModal.tsx` al español:
- `isRegister` -> `esRegistro`
- `email` -> `correo`
- `name` -> `nombre`
- `password` -> `contrasena`
- `showPassword` -> `mostrarContrasena`
- `rememberMe` -> `recordarme`
¿Apruebas estos cambios en las variables antes de proceder con la implementación?

## What Changes

- **Integración de Login:** Si `esRegistro` es falso, enviar una petición a `POST /api/v1/auth/login` con el `correo` y `contrasena`. Al recibir éxito (200 OK y el DTO con token), invocar `onLoginSuccess`.
- **Integración de Registro:** Si `esRegistro` es verdadero, enviar una petición a `POST /api/v1/auth/registro` con `nombre`, `correo` y `contrasena`. Al recibir éxito, invocar `onLoginSuccess`.
- **Nomenclatura y Limpieza:** Aplicación del español para todas las variables y funciones internas (`manejarEnvio` en lugar de `handleSubmit`).
- **Mantenimiento del Diseño:** La interfaz actual, basada en TailwindCSS y el estilo "premium", se conservará exactamente igual.

## Capabilities

### New Capabilities
- `auth-api-integration`: Capacidad del `LoginModal` para autenticar y registrar usuarios contra el backend real en lugar de simular la acción.

### Modified Capabilities
Ninguna.

## Impact

- `src/components/LoginModal.tsx`: Se agregará un estado de carga (`cargandoApi`) y manejo de errores (`errorApi`) para proporcionar _feedback_ visual (ej. deshabilitar el botón de envío y mostrar mensaje de error si el login/registro falla), sin alterar el diseño existente.
- Se preserva el patrón de no modificar el backend; el cliente mapeará su estado interno a los cuerpos esperados por la API.
