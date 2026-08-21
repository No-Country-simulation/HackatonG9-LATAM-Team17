## Why

Actualmente, cuando una mutación (como actualizar el perfil o agregar/eliminar una transacción) falla en el backend, la aplicación muestra un error global pero los componentes locales asumen falsamente que la operación fue exitosa. Esto se debe a que la promesa del fetch no se propaga correctamente a los componentes hijos. Resolver esto es crítico para un entorno de producción, ya que evita que los usuarios vean un "falso positivo" (ej. "¡Información Guardada!") mientras que la acción en realidad falló.

## What Changes

- Modificación de firmas de funciones manejadoras en `App.tsx` (ej. `handleUpdateProfile`, `handleAddTransaction`, `handleDeleteTransaction`) para retornar `Promise<void>` en lugar de tragar las excepciones.
- Incorporación de `throw e` en los bloques `catch` de las mutaciones en `App.tsx` para propagar el fallo a los componentes que invocan la acción.
- Refactorización en `SettingsProfileView.tsx` para hacer asíncronas las funciones `manejarGuardarBasico` y `manejarGuardarFinanciero`, esperando la resolución de la promesa antes de mostrar el mensaje de éxito (estado `exitoGuardadoBasico` y `exitoGuardadoFinanciero`).
- Refactorización en `DashboardView.tsx` y `NewAnalysisView.tsx` (si aplica) para limpiar los formularios solo si la promesa de agregación de transacción se resuelve sin errores.
- **BREAKING**: Los props expuestos por `App.tsx` para manejar mutaciones ahora son formalmente asíncronos (`Promise<void>`) y los componentes hijos *deben* envolverlos en un bloque `try/catch` o usar `await`.

## Capabilities

### New Capabilities

- `propagacion-errores-mutaciones`: Estandarización del manejo local de errores asíncronos en componentes que invocan mutaciones de datos (creación, edición, eliminación), asegurando que el estado visual de "éxito" solo se muestre tras una confirmación real, eliminando los falsos positivos.

### Modified Capabilities

- Ninguna (no hay cambios en requerimientos a nivel de backend ni nuevas funciones del sistema, solo corrección de comportamiento de UI local).

## Impact

- `src/App.tsx`: Cambios en la firma y el `catch` de `handleUpdateProfile`, `handleAddTransaction`, `handleDeleteTransaction`.
- `src/components/SettingsProfileView.tsx`: Cambios en manejadores de envío de formulario para usar `await` y capturar fallos.
- `src/components/NewAnalysisView.tsx`: Cambios en el formulario de agregar transacción para no resetear estado local si falla.
- `src/types/index.ts` (si aplica): Actualización de interfaces que definan estos props para forzar el retorno de `Promise<void>`.
