## Why

Actualmente, el frontend arroja un error de conexión al intentar enviar el formulario. Los logs de Spring Boot muestran un `NoResourceFoundException: No static resource api/v1/analisis`. Esto ocurre porque el frontend está apuntando a una ruta incorrecta o incompleta. El controlador `AnalisisController` ha sido actualizado y ya no existe un endpoint en la raíz `/api/v1/analisis`; en su lugar, requiere enviar el POST a la ruta específica del usuario.

## What Changes

- Actualización de la URL de `fetch` en el frontend para apuntar al nuevo contrato del backend: `http://localhost:8080/api/v1/analisis/perfil/USR-1001`.
- Verificación del payload JSON para garantizar que calce con `AnalisisInputDTO`.
- Preservación de la resiliencia UI (manejo del catch para mostrar el banner si el servidor no responde).

## Capabilities

### New Capabilities
- `backend-endpoint-sync`: Sincronización de la URL y contrato del frontend con la última versión de los Controladores de Spring Boot.

### Modified Capabilities
- (None)

## Impact

- **Affected Code**: `src/components/FormularioAnalisis.tsx`.
- **APIs**: Conexión con `POST /api/v1/analisis/perfil/{usuarioId}`.
