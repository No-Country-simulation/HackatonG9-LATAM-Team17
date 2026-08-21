## Why

Actualmente existen cuatro fricciones importantes en la interfaz de usuario del perfil y autenticación:
1. Formularios pre-rellenados (mocks) que confunden al usuario en producción.
2. Un error tipográfico en `SettingsProfileView.tsx` (`correo` en vez de `email`) que causa que el campo de correo aparezca vacío y que la funcionalidad de "Eliminar Cuenta" falle con un 404 (porque envía `undefined` al backend).
3. El nombre real del usuario no se visualiza después del login porque el frontend usaba un *workaround* extrayéndolo del correo, lo cual ya es innecesario gracias a que el backend ahora devuelve el campo `nombre` en la respuesta (según `docs/CAMBIO_LOGIN_NOMBRE.md`).
4. Falta de protección contra edición accidental en el perfil, ya que los campos están habilitados de forma predeterminada sin un modo explícito de "Edición".

## User Review Required

> [!IMPORTANT]
> El cambio propuesto incluye eliminar el estado `userProfile.correo` y reemplazarlo por `userProfile.email` para coincidir con la interfaz TypeScript `UserProfile`. Se asume que este fue un error de tipeo. Adicionalmente, los campos de configuración financiera y básica pasarán a estar bloqueados (readonly) hasta que el usuario presione un botón de "Editar", mejorando la seguridad UX.

## What Changes

- Limpieza de valores iniciales (mocks) en `LoginModal.tsx` y `SettingsProfileView.tsx`, dejándolos como strings vacíos.
- Lectura de `data.nombre` desde la respuesta del login del backend, reemplazando la extracción del nombre a partir del correo.
- Corrección de la variable `userProfile.correo` a `userProfile.email` en `SettingsProfileView.tsx`, arreglando la mutación del email y la URL de "Eliminar cuenta".
- Implementación de un modo "Edición" en `SettingsProfileView.tsx`, introduciendo un botón para habilitar/deshabilitar los inputs del formulario.

## Capabilities

### New Capabilities
- `edicion-protegida-perfil`: Los campos de configuración de perfil no deben ser editables de forma inmediata, requiriendo un botón de acción explícita para evitar modificaciones accidentales.

### Modified Capabilities
- 

## Impact

- `src/components/LoginModal.tsx`: Limpieza de mocks y actualización del parseo de la respuesta `data.nombre`.
- `src/components/SettingsProfileView.tsx`: Corrección de la propiedad `email`, limpieza de mocks, inyección del estado `modoEdicion` y botón visual de editar.
