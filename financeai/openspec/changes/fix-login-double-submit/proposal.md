## Why

El componente `LoginModal.tsx` contiene un bug crítico de "doble-submit". Actualmente, al presionar "Iniciar Sesión" repetidas veces (o mediante doble clic), el formulario envía múltiples peticiones HTTP concurrentes al backend antes de que el estado asíncrono de React (`cargandoApi`) logre deshabilitar el botón. Esta colisión en el servidor Tomcat genera un error de red, resultando recurrentemente en un `SocketTimeoutException` o corrompiendo los headers de la petición, lo que ocasiona que el backend devuelva errores no manejados como 500 o 415.

## What Changes

- Modificación de la función `manejarEnvio` en `LoginModal.tsx` para agregar una guardia inmediata sincrónica `if (cargandoApi) return;` que bloquee clics subsecuentes mientras la petición ya está en curso.

## Capabilities

### New Capabilities
- `bloqueo-doble-submit`: Introducción de guardias síncronas en componentes interactivos clave para prevenir colisiones en llamadas asíncronas HTTP.

### Modified Capabilities
- 

## Impact

- `src/components/LoginModal.tsx`: Único archivo impactado, requiriend
