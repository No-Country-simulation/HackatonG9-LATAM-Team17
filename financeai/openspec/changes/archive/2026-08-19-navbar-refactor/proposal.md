## Why
Revisando el componente `TopNavbar.tsx` y cruzándolo con el documento de endpoints (`API_BACKEND_ENDPOINTS.md`), **NO EXISTE NINGUNA CONEXIÓN directaa requerida**. Las funcionalidades de este componente (notificaciones, menú de usuario, barra de búsqueda y botón de logout) no tienen un equivalente en el backend según el documento actual (no hay endpoints de notificaciones ni de búsqueda global). 

Sin embargo, aplicando la regla global de coincidencias del proyecto: *"Todo el proyecto usa variables y nombres íntegramente en ESPAÑOL. Se debe conservar en todo momento el uso de `camelCase` para variables y funciones"*, es necesario refactorizar el estado del componente.

## User Review Required
**Aviso:** No hay conexión de endpoints en este componente. ¿Estás de acuerdo con aplicar únicamente la refactorización de nomenclatura (traducir el estado al español) para cumplir con las reglas del proyecto?

## What Changes
- **Nomenclatura (Español):**
  - Renombrar estados y variables: `showNotifications` -> `mostrarNotificaciones`, `showUserDropdown` -> `mostrarMenuUsuario`, `searchQuery` -> `busqueda`, `subTabs` -> `subPestanas`, `notifications` -> `notificaciones`.
- **Diseño Conservado:**
  - El diseño visual de la barra superior de navegación y clases de TailwindCSS se mantendrán 100% inalterados.

## Capabilities
### Modified Capabilities
- `navbar-refactor`: Refactoriza las variables internas al español según las convenciones del proyecto, sin añadir conexiones API ya que no existen endpoints que apliquen a esta vista.

## Impact
- `src/components/TopNavbar.tsx`: Cambios limitados a declaración de estado reactivo y mapeo JSX.
