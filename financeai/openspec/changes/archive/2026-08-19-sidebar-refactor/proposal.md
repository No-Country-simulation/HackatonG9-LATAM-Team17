## Why
Revisando el componente `Sidebar.tsx` y cruzándolo con el documento de endpoints (`API_BACKEND_ENDPOINTS.md`), **NO EXISTE NINGUNA CONEXIÓN directa requerida**. Las funcionalidades de este componente (navegación entre pestañas, abrir modal de nuevo análisis y botón de logout) delegan la lógica completamente a través de los props que reciben, y no requieren ejecutar endpoints de backend directamente desde aquí.

Sin embargo, para cumplir con la regla global del proyecto: *"Todo el proyecto usa variables y nombres íntegramente en ESPAÑOL. Se debe conservar en todo momento el uso de `camelCase` para variables y funciones"*, el componente aún contiene identificadores en inglés (ej. `navItems`, `handleTabClick`, `sidebarContent`).

## User Review Required
**Aviso:** No hay conexión de endpoints en este componente. ¿Estás de acuerdo con aplicar únicamente la refactorización de nomenclatura (traducir el código al español) para cumplir con las reglas del proyecto?

## What Changes
- **Nomenclatura (Español):**
  - Renombrar variables y funciones: `navItems` -> `elementosNavegacion`, `handleTabClick` -> `manejarClicPestana`, `handleNewAnalysisClick` -> `manejarClicNuevoAnalisis`, `handleLoginClick` -> `manejarClicLogin`, `sidebarContent` -> `contenidoSidebar`.
- **Diseño Conservado:**
  - El diseño visual de la barra lateral, su responsividad y clases de TailwindCSS se mantendrán 100% inalterados.

## Capabilities
### Modified Capabilities
- `sidebar-refactor`: Refactoriza las variables internas al español según las convenciones del proyecto, sin añadir conexiones API ya que el componente es presentacional puro y delega todo al contenedor superior.

## Impact
- `src/components/Sidebar.tsx`: Cambios limitados a declaración de constantes y nombres de funciones internas.
