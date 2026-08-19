## Why
El componente `SettingsProfileView.tsx` contiene un flujo para eliminar la cuenta del usuario. Revisando el `API_BACKEND_ENDPOINTS.md`, existe un endpoint `DELETE /api/v1/auth/eliminar?email={email}` exactamente para este propósito. Actualmente, el componente simula esta acción con un `setTimeout` y variables en inglés (`isDeleting`, `deleteConfirmText`, etc.). Para tener un producto funcional e integrado, debemos conectar este flujo al backend y aplicar la regla global del proyecto sobre el uso estricto de nomenclatura en español en todo el estado interno.

## User Review Required
**⚠️ ADVERTENCIA: Eliminación de Cuenta Real**
- Se conectará la confirmación del modal con una petición real `DELETE` hacia `http://localhost:8080/api/v1/auth/eliminar?email={email}` usando el email configurado en el estado (`correo` o `email`). 
- Si el backend devuelve un error 404 u otro, se mostrará un mensaje amigable al usuario (manteniendo el estado de la UI o avisando que hubo un problema) sin cerrar el modal prematuramente.
- ¿Apruebas la integración directa de esta petición destructiva desde el modal de ajustes?

## What Changes
- **Nomenclatura (Español):**
  - Renombrar estados: `fullName` -> `nombreCompleto`, `email` -> `correo`, `currentPassword` -> `contrasenaActual`, `newPassword` -> `nuevaContrasena`, `showCurrentPass` -> `mostrarContrasenaActual`, `showNewPass` -> `mostrarNuevaContrasena`, `savedBasicSuccess` -> `exitoGuardadoBasico`, `incomeTotal` -> `ingresoTotal`, `debtRatio` -> `nivelEndeudamiento`, `savingsFreq` -> `frecuenciaAhorro`, `totalDebts` -> `deudasTotales`, `monthlyDebtPay` -> `pagoMensualDeuda`, `emergencyFund` -> `fondoEmergencia`, `savedFinSuccess` -> `exitoGuardadoFinanciero`, `showDeleteModal` -> `mostrarModalEliminar`, `deleteConfirmText` -> `textoConfirmacionEliminar`, `isDeleting` -> `estaEliminando`, `deletedNotice` -> `avisoEliminado`.
- **Integración de Backend (Endpoint `DELETE`):**
  - Modificar la función `handleConfirmDeleteAccount` (a renombrar como `manejarConfirmarEliminarCuenta`) para que envíe una petición `DELETE` con la URL base y el email (`fetch(\`http://localhost:8080/api/v1/auth/eliminar?email=\${correo}\`, { method: 'DELETE' })\`).
  - Mostrar la pantalla de éxito (`avisoEliminado`) solo si la respuesta del API es correcta (status 200).
- **Diseño Conservado:**
  - El diseño visual del modal de zona de peligro y configuración general de tailwind se mantendrán 100% inalterados.

## Capabilities
### Modified Capabilities
- `settings-api-integration`: Integra la lógica de eliminación de perfil mediante API y unifica todas las variables al español.

## Impact
- `src/components/SettingsProfileView.tsx`: Cambios limitados a declaración de estado, JSX de data binding e implementación del fetch.
