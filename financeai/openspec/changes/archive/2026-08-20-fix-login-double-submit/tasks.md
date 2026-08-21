## 1. Bloqueo de Concurrencia en Login

- [x] 1.1 Localizar la función `manejarEnvio` dentro de `src/components/LoginModal.tsx`.
- [x] 1.2 Agregar la sentencia `if (cargandoApi) return;` inmediatamente después del `e.preventDefault();`.
- [x] 1.3 Verificar que el flujo natural de carga (mostrar el spinner en el botón) no se vea afectado y siga funcionando correctamente para el primer envío.
