## Context

Actualmente, la aplicación en `App.tsx` utiliza un modelo donde el estado inicial del perfil de usuario y otros datos críticos (transacciones, historial) se carga con "mocks" (datos ficticios). Además, el componente `LoginModal` se muestra sobre el layout principal (Dashboard, Sidebar), permitiendo que la interfaz principal sea visible y operativa (con mocks) antes de que el usuario haya iniciado sesión correctamente. Esto es inaceptable para una aplicación financiera, donde la autenticación debe ser una barrera estricta.

## Goals / Non-Goals

**Goals:**
- Asegurar que la aplicación nunca exponga la interfaz de usuario protegida antes de que la autenticación haya sido validada.
- Eliminar completamente la inyección de datos ficticios (mocks) del estado de `App.tsx`.
- Manejar de forma robusta los "estados vacíos" (cuando el usuario no tiene transacciones ni análisis).
- Proveer una experiencia de usuario (UX) premium con pantallas de carga al validar la sesión y un inicio de sesión que bloquee el acceso al layout.

**Non-Goals:**
- No se creará un sistema de rutas complejo con `react-router-dom` por el momento si puede solucionarse con bloqueo de renderizado en `App.tsx` (Render Blocking).
- No se modificarán los endpoints del backend (restricción arquitectónica).
- No se cambiarán las funcionalidades existentes de predicción de la IA, solo cómo se manejan si no hay datos.

## Decisions

**1. Bloqueo de Renderizado en `App.tsx` (Render Blocking)**
Se implementará una máquina de estados estricta en el nivel más alto de la aplicación (`App.tsx`):
- `cargandoAuth` (boolean): Bloquea la renderización completa de la app para mostrar un `Loader` a pantalla completa.
- `isAuthenticated` (boolean): Determina si se muestra el layout de inicio de sesión/registro o el layout principal (Dashboard).
- *Alternativa considerada*: Usar `react-router-dom`. *Razón de rechazo*: Añadiría complejidad innecesaria para el MVP si solo necesitamos ocultar el Dashboard. El bloqueo condicional simple de React es suficiente para evitar el montaje de componentes protegidos.

**2. Conversión de LoginModal a Full Screen**
El componente `LoginModal` será modificado o encapsulado para que ocupe el 100% de la pantalla (`w-full min-h-screen`) con un fondo sólido o un diseño que no deje ver ningún componente subyacente.
- *Razón*: La seguridad visual es primordial.

**3. Eliminación de Mocks y Adopción de `null`**
Los estados en `App.tsx` (`userProfile`, `transactions`, `currentReport`, `analysisHistory`) iniciarán en `null` o `[]` en lugar de objetos llenos de datos falsos.
- *Razón*: Evita que la interfaz intente renderizar gráficos con datos que no existen.
- *Impacto*: Requerirá añadir comprobaciones de nulos (`?`) en componentes hijos o mostrar pantallas de "Empezar" (Empty States).

**4. Empty States en Componentes Hijos**
`DashboardView` y `HistoryView` deberán manejar estados donde no hay transacciones o donde el último reporte es nulo. Se diseñarán con un UI amigable que invite a agregar la primera transacción.

## Risks / Trade-offs

- [Risk] Errores por propiedades indefinidas (`TypeError: Cannot read properties of null`) en componentes profundamente anidados si no se actualizan correctamente para manejar `null`.
  - **Mitigation**: El renderizado condicional del layout principal solo ocurrirá si `userProfile` no es nulo y la sesión es válida. Sin embargo, para `currentReport`, se debe asegurar una validación en la UI.
- [Risk] Experiencia de carga lenta si la API demora en responder a la validación de sesión.
  - **Mitigation**: Mantener `cargandoAuth = true` mientras se resuelve la petición, mostrando una animación premium en pantalla.
