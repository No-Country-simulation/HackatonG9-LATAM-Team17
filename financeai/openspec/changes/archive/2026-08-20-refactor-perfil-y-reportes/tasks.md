## 1. Refactorización de SettingsProfileView.tsx

- [x] 1.1 Eliminar los estados `contrasenaActual`, `nuevaContrasena` y `confirmarContrasena`.
- [x] 1.2 Eliminar el bloque de JSX correspondiente a la sección "Seguridad (Contraseña)" del perfil.
- [x] 1.3 Eliminar los estados y campos del formulario de "Fondo de Emergencia" y "Pago mensual de deuda" de la sección "Parámetros Financieros".
- [x] 1.4 Eliminar dichas propiedades del payload que se pasa a `onUpdateProfile` en la función `manejarGuardarFinanciero`.
- [x] 1.5 Reemplazar el `<input type="range">` del Nivel de Endeudamiento por un elemento de barra de progreso (progress bar) visual estático de solo lectura.

## 2. Refactorización de ReportsView.tsx

- [x] 2.1 Identificar variables o datos hardcodeados en los gráficos (por ejemplo, categorías mockeadas).
- [x] 2.2 Sustituirlos utilizando `currentReport.distribucionCategorias` o los arrays provenientes del análisis actual.
- [x] 2.3 Verificar que el `userProfile.ratioDeuda` y otras métricas se pinten correctamente y provengan del estado global en vez de datos de prueba.
