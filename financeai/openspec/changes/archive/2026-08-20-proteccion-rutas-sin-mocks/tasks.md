## 1. Modificación de Estado y Eliminación de Mocks en App.tsx

- [x] 1.1 Eliminar los datos iniciales pre-rellenados (mocks) de `userProfile` e inicializar con `null`.
- [x] 1.2 Eliminar los mocks de `transactions` e inicializar como un arreglo vacío `[]`.
- [x] 1.3 Eliminar los mocks de `currentReport` e inicializar con `null`.
- [x] 1.4 Eliminar los mocks de `analysisHistory` e inicializar con `[]`.
- [x] 1.5 Crear el estado booleano `cargandoAuth` inicializado en `true` en `App.tsx`.
- [x] 1.6 Actualizar el `useEffect` principal que hace la carga inicial. Al terminar exitosamente, actualizar datos y poner `cargandoAuth = false`. Si el fetch retorna 401 (catch), setear `cargandoAuth = false` y `userProfile = null`.

## 2. Refactor del Renderizado Principal (Render Blocking) en App.tsx

- [x] 2.1 Agregar una condición temprana (early return) en el `return` de `App.tsx`: si `cargandoAuth === true`, devolver un componente a pantalla completa (ej. `div` centrado con `<Loader2 className="animate-spin" />`).
- [x] 2.2 Agregar segunda condición temprana: si `cargandoAuth === false` y `userProfile === null`, devolver el componente `LoginModal` asegurando que ocupe `100vw` y `100vh` sin dejar que el contenido protegido se monte por detrás.
- [x] 2.3 Mantener el renderizado del layout principal (Sidebar, TopNavbar, Routes) solo como fallback final cuando se superan las dos condiciones anteriores.

## 3. Empty States en Componentes Hijos

- [x] 3.1 Revisar `DashboardView.tsx` para evitar errores fatales si `report` es null o undefinido (mostrar una invitación de "Genera tu primer análisis" en su lugar).
- [x] 3.2 Modificar `DashboardView.tsx` en la sección de transacciones para asegurar que maneja un estado vacío adecuadamente cuando `transactions.length === 0`.
- [x] 3.3 Revisar `HistoryView.tsx` para comprobar que maneje `analysisHistory = []` mostrando su empty state ya existente en vez de colapsar.

## 4. Estilos y Mejoras Visuales (LoginModal)

- [x] 4.1 Modificar `LoginModal.tsx` o el contenedor en `App.tsx` para que el fondo del login sea opaco y no translúcido, removiendo cualquier vestigio de su rol anterior como modal superpuesto.
- [x] 4.2 Agregar micro-animación en la pantalla de carga inicial (`cargandoAuth`) para que se sienta una transición fluida al pasar a login o al dashboard.

## 5. Pruebas y Validación Manual

- [x] 5.1 Reiniciar la aplicación y confirmar que se muestra el spinner antes del login.
- [x] 5.2 Confirmar que no hay parpadeos de la UI (FOUC) del Dashboard detrás del formulario de inicio de sesión.
- [x] 5.3 Iniciar sesión con un usuario nuevo (sin transacciones) y verificar que no haya errores de React por intentar acceder a propiedades de un reporte que no existe.
