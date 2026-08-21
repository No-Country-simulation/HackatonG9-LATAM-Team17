## 1. Refactorización del Manejo de Errores (App.tsx)

- [x] 1.1 Localizar el bloque `if (res.status === 401)` dentro de la función `fetchConManejo` y cambiar la asignación para que use estrictamente `setUserProfile(null)`.
- [x] 1.2 En ese mismo bloque, eliminar la llamada a `setShowLoginModal(true)`.
- [x] 1.3 Localizar la función `handleDeleteAccount` y cambiar la inicialización para que asigne `setUserProfile(null)` en lugar de un objeto falso.
- [x] 1.4 Dentro de `handleDeleteAccount`, eliminar la llamada a `setShowLoginModal(true)`.

## 2. Limpieza de Código Muerto (App.tsx)

- [x] 2.1 Eliminar por completo el Hook de estado `const [showLoginModal, setShowLoginModal] = useState(false);`.
- [x] 2.2 Actualizar las props `onOpenLogin` (que se envían a `Sidebar` y `TopNavbar`) para que su función anónima ejecute explícitamente `setUserProfile(null)` como mecanismo oficial de cerrado de sesión.
- [x] 2.3 Revisar la estructura JSX retornada por `MainApp` y eliminar cualquier renderizado que pudiese depender del boolean `showLoginModal` (si quedase alguno oculto).

## 3. Pruebas y Validación Manual

- [x] 3.1 Provocar intencionalmente un error HTTP 401 (ej. mockeando un `throw` en `fetchConManejo`) y comprobar que la aplicación muestra directamente la pantalla de inicio de sesión sin pestañear.
- [x] 3.2 Usar la acción de "Borrar Cuenta" (o un logout) y validar visualmente que los datos del tablero no quedan pegados detrás de una pantalla inoperable.
