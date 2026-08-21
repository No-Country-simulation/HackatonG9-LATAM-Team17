## Context

Actualmente, no se fuerza al usuario nuevo a configurar sus datos financieros básicos post-registro. La validación se deja a la pantalla de "Nuevo Análisis", pero la UX deseada exige que esta configuración inicial sea un paso obvio, ineludible y visualmente atractivo nada más iniciar sesión (`App.tsx` / `DashboardView.tsx`).

## Goals / Non-Goals

**Goals:**
- Implementar un nuevo componente `<OnboardingModal />`.
- Detectar en `App.tsx` (o donde sea pertinente) si el `userProfile` actual carece de `ingresoMensual` o `deudaTotal`, y de ser así, renderizar y obligar el uso del `OnboardingModal`.
- Configurar el modal con el mismo *feel* "premium" de `LoginModal` (glassmorphism, animaciones).
- Permitir que una vez completado el onboarding, el usuario ingrese al flujo normal y pueda actualizar estos datos solo desde `SettingsProfileView.tsx`.
- Bloquear la entrada de estos datos en `NewAnalysisView.tsx` (esto ya fue cubierto en gran medida, pero aquí se integrará la validación cruzada).

**Non-Goals:**
- No se crearán nuevos endpoints de backend (los datos del `userProfile` ya se persisten mediante `PUT /api/profile`).
- No se obligará al usuario a llenar los "Indicadores Avanzados" en el onboarding (solo la base).

## Decisions

- **Arquitectura del Modal:** Se creará un componente `<OnboardingModal />` en `src/components/`. Recibirá las props: `isOpen` (boolean), `userProfile` (para pre-cargar si hace falta, aunque estará vacío) y `onComplete` (callback con los datos).
- **Lógica de renderizado en App:** En `App.tsx`, se evaluará `const necesitaOnboarding = userProfile && (!userProfile.ingresoMensual || userProfile.ingresoMensual <= 0);`. Si es true, se renderiza encima del contenido principal, sin botón de cierre explícito (para forzar su llenado).
- **Envío de datos:** Al dar clic en "Comenzar", el modal invocará `handleUpdateProfile` (desde App.tsx) enviando el ingreso, deuda y frecuencia de ahorro, lo que actualizará el estado global y ocultará el modal de forma automática.
- **Componente Nuevo:**
  ```typescript
  interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: (datos: { ingresoMensual: number, deudaTotal: number, frecuenciaAhorro: SavingsFrequency }) => void;
  }
  ```

## Risks / Trade-offs

- **Fricción:** Obligar a un usuario a llenar datos justo después del login incrementa la fricción, pero es un trade-off necesario porque FinanceAI no funciona sin estos parámetros base.
- **Fallas de API:** Si la API falla al guardar el perfil en el onboarding, el modal no debe cerrarse, permitiendo al usuario reintentar.
