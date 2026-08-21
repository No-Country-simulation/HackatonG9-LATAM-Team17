## Context
El componente `TopNavbar.tsx` requiere refactorización de su nomenclatura interna para cumplir con la regla estricta del proyecto de uso de idioma español y `camelCase` para variables y funciones. Al comparar con el archivo `API_BACKEND_ENDPOINTS.md`, se determinó que no existen endpoints backend correspondientes para las funcionalidades de esta vista (notificaciones, menú, búsqueda global). Por lo tanto, el alcance es puramente cosmético a nivel de código fuente.

## Goals / Non-Goals
**Goals:**
- Traducir todas las variables reactivas locales (`showNotifications`, `showUserDropdown`, `searchQuery`) a sus equivalentes en español.
- Renombrar constantes locales como `subTabs` y `notifications` para mantener uniformidad en el módulo.
- Preservar el estilo (TailwindCSS) original e inalterable.

**Non-Goals:**
- **NO se implementarán** llamadas a endpoints backend (fetch) en este componente. Como fue revisado, las notificaciones y búsqueda no están soportadas por el actual backend `API_BACKEND_ENDPOINTS.md`.
- No se alterarán los `props` expuestos por el componente (`activeSubTab`, `onNavigateTab`, etc.) ya que estos definen el contrato con sus padres (ej. `DashboardLayout.tsx`).

## Decisions
**1. Alcance de Refactorización**
- *Decisión*: Sólo se modificará el estado interno y las constantes duras.
- *Racional*: Garantizar el principio de menor sorpresa y adherirse a la regla lingüística del frontend sin inventar rutas backend que resultarían en errores 404.

## Risks / Trade-offs
- **[Riesgo]** Errores de compilación si los mapeos del render no se actualizan acorde a la nueva nomenclatura.
  - **Mitigación**: Sustitución con comprobación estática (`npx tsc --noEmit`).
