## 1. Modificación de Props y Firmas en Padre (App.tsx)

- [x] 1.1 Modificar la firma de `handleUpdateProfile` en `App.tsx` para retornar `Promise<void>`. Agregar `throw e;` en su bloque `catch`.
- [x] 1.2 Modificar la firma de `handleAddTransaction` en `App.tsx` para retornar `Promise<void>`. Agregar `throw e;` en su bloque `catch`.
- [x] 1.3 Modificar la firma de `handleDeleteTransaction` en `App.tsx` para retornar `Promise<void>`. Agregar `throw e;` en su bloque `catch`.
- [ ] 1.4 Si existen interfaces para los props de los componentes hijos en `App.tsx` o `types`, actualizarlas para reflejar `Promise<void>`.

## 2. Refactorización en Hijos: SettingsProfileView

- [x] 2.1 Convertir `manejarGuardarBasico` en `SettingsProfileView.tsx` a `async`. Envolver `onUpdateProfile` en `try/catch` y solo establecer `setExitoGuardadoBasico(true)` en caso de éxito.
- [x] 2.2 Convertir `manejarGuardarFinanciero` en `SettingsProfileView.tsx` a `async`. Envolver `onUpdateProfile` en `try/catch` y solo establecer `setExitoGuardadoFinanciero(true)` en caso de éxito.

## 3. Refactorización en Hijos: Componentes de Transacciones

- [x] 3.1 En `NewAnalysisView.tsx`, convertir `handleAddTx` a asíncrono (si llama directamente al handle padre) o, alternativamente, ajustar si solo maneja estado local (en este último caso, verificar si requiere conexión con App.tsx o es 100% local. Si es 100% local, ignorar).
- [x] 3.2 En `DashboardView.tsx` (u otro componente que agregue transacciones reales), envolver el llamado a `onAddTransaction` en `try/catch`. Resetear el formulario solo si el `await` se resuelve correctamente.
- [x] 3.3 Revisar la invocación de `onDeleteTransaction` en `DashboardView.tsx` o historial para usar `await` (si requiere feedback inmediato en UI hijo, aunque usualmente solo se dispara la acción).

## 4. Pruebas y Validación Manual

- [x] 4.1 Simular fallo al actualizar el perfil (ej. desconectando red) y confirmar que NO aparece el check verde de éxito en `SettingsProfileView`, pero SÍ aparece el toast global.
- [x] 4.2 Simular fallo al agregar transacción y confirmar que los inputs del formulario retienen el texto escrito por el usuario.
