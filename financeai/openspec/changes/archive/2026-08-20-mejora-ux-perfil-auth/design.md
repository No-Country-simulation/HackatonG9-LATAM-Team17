## Context

Actualmente la configuración del perfil (`SettingsProfileView.tsx`) y el modal de autenticación (`LoginModal.tsx`) tienen fallos de UX y bugs lógicos:
1. Valores *mock* por defecto (`alex@example.com`, `Alex Doe`, ingresos hardcodeados) que resultan molestos en producción.
2. Un error en `SettingsProfileView.tsx` (`userProfile.correo` en vez de `email`) que genera un valor `undefined` y rompe la lógica de "Eliminar cuenta".
3. Un parseo subóptimo del nombre real en el login que recurre a cortar el email.
4. Falta de protección contra la edición de campos en el perfil.

## Goals / Non-Goals

**Goals:**
- Sanear los estados iniciales de los formularios para que arranquen vacíos.
- Arreglar el error de la propiedad `email`.
- Usar el campo `nombre` provisto por el backend en la respuesta del endpoint de Login.
- Bloquear la edición del perfil con un modo de lectura/escritura explícito.

**Non-Goals:**
- No se agregará guardado automático de los campos de edición.
- No se creará persistencia extra fuera del manejo actual; los cambios seguirán los mismos callbacks `onUpdateProfile`.

## Decisions

- **Limpieza de mocks**: Todos los `useState` iniciales de texto duro se pasarán a `""` (string vacío) o al respectivo mapeo del perfil en el caso de la vista de configuración.
- **Acceso a la variable correcta**: Se modificará `useState(userProfile.correo)` a `useState(userProfile.email)`. Esto arregla indirectamente la URL de eliminación (`/api/v1/auth/eliminar?email=${correo}`).
- **Modo edición**: Se creará un estado `const [modoEdicion, setModoEdicion] = useState(false)`. Los `<input>` recibirán `disabled={!modoEdicion}`. Un botón en la cabecera alternará este estado.
- **Parseo de nombre en Login**: Dado el cambio documentado en el backend, la línea en `LoginModal.tsx` pasará a ser `const nombreAUsar = data.nombre || correo.split('@')[0];` sin importar si es login o registro, ya que ambos ahora exponen el campo.

## Risks / Trade-offs

- Al requerir "Modo Edición", se añade un click adicional, pero esto mejora considerablemente la prevención de mutaciones accidentales.
