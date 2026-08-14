## 1. Integración con el Nuevo Endpoint

- [x] 1.1 Localizar el componente o servicio en Next.js encargado de hacer el fetch de los datos (`FormularioAnalisis.tsx`).
- [x] 1.2 Actualizar la URL del fetch para que apunte exactamente a `http://localhost:8080/api/v1/analisis/perfil/USR-1001` (utilizaremos `USR-1001` como ID de usuario mock temporalmente para esta versión).
- [x] 1.3 Verificar que el payload que se envía en el body coincida estructuralmente con lo que espera el `AnalisisInputDTO` del backend.
- [x] 1.4 Asegurarse de que el manejo de errores (bloque `catch`) mantenga el banner de aviso de conectividad actual si el servidor realmente está apagado.
