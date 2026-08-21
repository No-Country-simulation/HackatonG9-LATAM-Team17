## Why

Actualmente, la aplicación carga componentes principales (como el Dashboard) en segundo plano antes de que el usuario haya iniciado sesión exitosamente y además, inyecta datos ficticios (mocks) al inicio para evitar valores nulos. Esto rompe la privacidad y lógica de una aplicación financiera estricta, y expone datos falsos temporalmente que confunden la experiencia de usuario. Es necesario implementar una barrera estricta que exija la autenticación antes de renderizar la aplicación principal y manejar adecuadamente los estados vacíos iniciales de perfiles reales.

## What Changes

- **Eliminación de Mocks**: Se eliminarán los datos iniciales "hardcodeados" en `App.tsx` para `userProfile`, `transactions`, `currentReport` y `analysisHistory`. Estos iniciarán como `null` o listas vacías.
- **Rutas y Vistas Protegidas**: Se implementará un bloqueo de renderizado estricto. Si no hay sesión válida o se está validando (`cargandoAuth`), se mostrará una pantalla de carga a pantalla completa. Si la autenticación falla (401), se mostrará exclusivamente la vista de Login/Registro.
- **Desacople del Layout Principal**: Componentes estructurales como Sidebar y TopNavbar ya no se montarán ni se harán visibles si no existe un `userProfile`.
- **Manejo de Estados Vacíos (Empty States)**: Actualización de componentes hijos para soportar escenarios donde el usuario recién registrado no tiene reportes generados ni transacciones previas.

## Capabilities

### New Capabilities
- `restriccion-acceso`: Barrera estricta de autenticación en frontend, pantallas de carga full-screen (loaders), y vista dedicada (o modal completo sin fondo subyacente) para inicio de sesión, impidiendo cualquier interacción o visualización de rutas protegidas sin credenciales válidas.
- `estados-vacios`: Manejo de datos nulos en perfiles recién creados (onboarding) y estado inicial vacío en el panel principal (Dashboard).

### Modified Capabilities
- N/A

## Impact

- `src/App.tsx`: Refactor mayor en el manejo de estado inicial (de mocks a valores nulos/vacíos) y lógica de enrutamiento condicional.
- `src/components/DashboardView.tsx`: Manejo de la variable `report` y `userProfile` si llegan vacíos.
- Posible refactor del `LoginModal` para convertirse en una vista principal (o modal a pantalla completa con fondo opaco) y una pantalla nueva o componente auxiliar para representar la carga inicial (spinner/animación premium).
