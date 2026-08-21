## Context

En la arquitectura actual de `App.tsx`, el componente `MainApp` controla el renderizado inicial y el bloqueo de acceso. Originalmente, se usaba un estado local booleano `showLoginModal` para controlar la visibilidad del modal de login, mostrando el fondo difuminado de un dashboard. Tras refactorizar el código para evitar renderizados parciales ("Flash of Unauthenticated Content"), se modificó el comportamiento para que el `LoginModal` se muestre a pantalla completa, condicionado exclusivamente a un Early Return `if (!userProfile)`. 

Sin embargo, las rutinas asíncronas antiguas (`fetchConManejo` en caso de error 401 y `handleDeleteAccount`) asumen un perfil "mock" al cerrar sesión y usan `setShowLoginModal(true)`. Al asignar este objeto "mock" en vez de `null`, superan la barrera `!userProfile` y evitan mostrar el modal (que ahora sólo renderiza si `userProfile` es nulo), dejando la UI trabada en un perfil fantasma.

## Goals / Non-Goals

**Goals:**
- Unificar la "fuente de la verdad" del estado de sesión: la única forma de que la sesión se considere inactiva será que `userProfile === null`.
- Adaptar las subrutinas de fallo de sesión (401 o cuenta eliminada) para que borren el perfil (`null`) en lugar de asignar objetos de recuperación ficticios.

**Non-Goals:**
- No se rediseñará el modal de inicio de sesión.
- No se alterarán los endpoints del backend ni el mecanismo de token, el alcance es puramente la reactividad del estado en `App.tsx`.

## Decisions

1. **Estricta eliminación del estado booleano `showLoginModal`:**
   Dado que `userProfile === null` actúa como el bloqueador definitivo en la raíz de renderizado, mantener un segundo estado `showLoginModal` es redundante y propenso a crear estados inválidos. Se eliminará el `useState` de `showLoginModal`.

2. **Forzar nulidad en expiración o cierre:**
   Las lógicas de captura de 401 en `fetchConManejo` y en `handleDeleteAccount` usarán `setUserProfile(null)`. Para soportar esto (ya que TypeScript y React lo permiten, pero la declaración lo limita), nos aseguraremos de que los callbacks como `onOpenLogin` pasados a `TopNavbar` y `Sidebar` ejecuten el mismo proceso de cierre de sesión forzoso (dejando caer el layout principal a favor de la barrera de login).

## Risks / Trade-offs

- **[Risk]** Componentes hijos (Sidebar, TopNavbar) que usaban `onOpenLogin` para abrir un modal auxiliar ahora forzarán un cierre total de la UI para volver al Login puro.
- **[Mitigation]** Esta es la UX deseada y esperada bajo el concepto de "Rutas Seguras", y elimina la confusión de tener múltiples capas superpuestas sin identidad válida.
