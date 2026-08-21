## 1. Traducción de Nomenclatura Principal
- [x] 1.1 Renombrar estados booleanos: `showNotifications` -> `mostrarNotificaciones`, `showUserDropdown` -> `mostrarMenuUsuario`.
- [x] 1.2 Renombrar estado de texto: `searchQuery` -> `busqueda`.
- [x] 1.3 Renombrar arreglos estáticos: `subTabs` -> `subPestanas`, `notifications` -> `notificaciones`.

## 2. Actualización de Enlaces en el JSX
- [x] 2.1 Sustituir `showNotifications` y `setShowNotifications` en el botón de la campana y la renderización condicional del popover.
- [x] 2.2 Sustituir `showUserDropdown` y `setShowUserDropdown` en el botón del perfil y el menú desplegable.
- [x] 2.3 Modificar el input de búsqueda global asignando `value={busqueda}` y `onChange={(e) => setBusqueda(e.target.value)}`.
- [x] 2.4 Actualizar los mapeos `.map()` para que usen `subPestanas` y `notificaciones`.

## 3. Verificación
- [x] 3.1 Compilar con TypeScript usando `npx tsc --noEmit`.
- [x] 3.2 Validar que el componente siga importando y utilizando los SVG e íconos sin alterar clases de estilo.
