## 1. Traducción de Nomenclatura Principal
- [x] 1.1 Renombrar variables básicas de autenticación y visualización en modal: `fullName` -> `nombreCompleto`, `email` -> `correo`, `currentPassword` -> `contrasenaActual`, `newPassword` -> `nuevaContrasena`, `showCurrentPass` -> `mostrarContrasenaActual`, `showNewPass` -> `mostrarNuevaContrasena`, `savedBasicSuccess` -> `exitoGuardadoBasico`.
- [x] 1.2 Renombrar variables financieras: `incomeTotal` -> `ingresoTotal`, `debtRatio` -> `nivelEndeudamiento`, `savingsFreq` -> `frecuenciaAhorro`, `totalDebts` -> `deudasTotales`, `monthlyDebtPay` -> `pagoMensualDeuda`, `emergencyFund` -> `fondoEmergencia`, `savedFinSuccess` -> `exitoGuardadoFinanciero`.
- [x] 1.3 Renombrar variables del modal de borrado de cuenta: `showDeleteModal` -> `mostrarModalEliminar`, `deleteConfirmText` -> `textoConfirmacionEliminar`, `isDeleting` -> `estaEliminando`, `deletedNotice` -> `avisoEliminado`.

## 2. Petición DELETE a la API de Autenticación
- [x] 2.1 Refactorizar la función `handleConfirmDeleteAccount` (renombrar a `manejarConfirmarEliminarCuenta`).
- [x] 2.2 Reemplazar el `setTimeout` mockeado por un bloque asíncrono con `try/catch`.
- [x] 2.3 Realizar petición `fetch` a `http://localhost:8080/api/v1/auth/eliminar?email=${correo}` usando `method: 'DELETE'`.
- [x] 2.4 Controlar la promesa. Si responde `ok`, mantener el cambio de bandera `setAvisoEliminado(true)` y finalizar temporizador para invocar `onDeleteAccount()`.
- [x] 2.5 Si la petición falla, imprimir por consola y quitar bandera `setEstaEliminando(false)` manteniendo el modal abierto sin el mensaje de éxito.

## 3. Actualización de Enlaces en el JSX
- [x] 3.1 Sustituir todas las antiguas variables reactivas en inglés embebidas en los inputs `value`, handlers `onChange` y validadores de `className` en el retorno JSX.
- [x] 3.2 Modificar el `disabled` del botón de eliminar verificando la nueva variable `textoConfirmacionEliminar.trim().toUpperCase() !== 'ELIMINAR' || estaEliminando`.

## 4. Verificación
- [x] 4.1 Compilar con TypeScript usando `npx tsc --noEmit`.
- [x] 4.2 Validar que ninguna clase de Tailwind se vea afectada.
