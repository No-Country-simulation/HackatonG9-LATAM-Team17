## 1. Mocks en LoginModal
- [x] 1.1 Localizar los hooks `useState` en `src/components/LoginModal.tsx` correspondientes a `correo`, `nombre` y `contrasena`.
- [x] 1.2 Reemplazar los valores por defecto (ej. `'alex@example.com'`) por strings vacíos `''`.
- [x] 1.3 Modificar el parseo de la respuesta en `manejarEnvio` para que asigne `const nombreAUsar = data.nombre || correo.split('@')[0];` independientemente del registro, aprovechando el nuevo campo del backend.

## 2. Correcciones en SettingsProfileView
- [x] 2.1 Localizar `const [correo, setCorreo] = useState(userProfile.correo);` en `src/components/SettingsProfileView.tsx` y cambiarlo por `userProfile.email`.
- [x] 2.2 Reemplazar los valores predeterminados (ej. `5200` y `'password123'`) pasados como fallbacks estáticos, asegurando que tomen `''` o `0` si el perfil carece de información (aunque ya están definidos en types).

## 3. Modo Edición en SettingsProfileView
- [x] 3.1 Añadir `const [modoEdicion, setModoEdicion] = useState(false);`.
- [x] 3.2 Añadir la propiedad `disabled={!modoEdicion}` a todos los elementos `<input>` y `<select>` dentro de los formularios principales.
- [x] 3.3 Incluir un botón "Editar Perfil" en la cabecera (`id="profile-header"`) que cambie el valor de `modoEdicion`.
- [x] 3.4 Hacer que los botones de "Guardar Cambios" sólo sean visibles o estén habilitados si `modoEdicion` es `true`. Y al guardar exitosamente, devolver a false.
