## 1. Traducción de Nomenclatura Principal
- [x] 1.1 Renombrar arreglo estático: `navItems` -> `elementosNavegacion`.
- [x] 1.2 Renombrar funciones manejadoras: `handleTabClick` -> `manejarClicPestana`, `handleNewAnalysisClick` -> `manejarClicNuevoAnalisis`, `handleLoginClick` -> `manejarClicLogin`.
- [x] 1.3 Renombrar constante JSX: `sidebarContent` -> `contenidoSidebar`.

## 2. Actualización de Enlaces en el JSX
- [x] 2.1 Sustituir iteración `navItems.map` por `elementosNavegacion.map`.
- [x] 2.2 Reemplazar la referencia al manejador de clic en cada botón del menú por `manejarClicPestana(item.id)`.
- [x] 2.3 Reemplazar la llamada a `handleNewAnalysisClick` en el botón principal por `manejarClicNuevoAnalisis`.
- [x] 2.4 Reemplazar la llamada a `handleLoginClick` en el botón inferior por `manejarClicLogin`.
- [x] 2.5 Actualizar la inyección de la constante `{sidebarContent}` por `{contenidoSidebar}` en los contenedores de Mobile y Desktop.

## 3. Verificación
- [x] 3.1 Compilar con TypeScript usando `npx tsc --noEmit`.
- [x] 3.2 Validar que ninguna clase de Tailwind se vea afectada.
