## Context
El componente `Sidebar.tsx` contiene identificadores internos (constantes y handlers) en inglés. Al comparar con el archivo `API_BACKEND_ENDPOINTS.md`, se determinó que no existen endpoints backend directos que este componente deba invocar por su cuenta. El alcance es puramente cosmético a nivel de nomenclatura en el código fuente.

## Goals / Non-Goals
**Goals:**
- Traducir todas las variables locales (`navItems`, `sidebarContent`) y funciones manejadoras (`handleTabClick`, `handleNewAnalysisClick`, `handleLoginClick`) a sus equivalentes idiomáticos en español.
- Preservar el estilo (TailwindCSS) original e inalterable.

**Non-Goals:**
- **NO se implementarán** llamadas a endpoints backend (fetch) en este componente. Como fue revisado, todas las acciones emiten eventos a través de propiedades expuestas y no es responsabilidad del `Sidebar` llamar a la API directamente.
- No se alterarán los nombres de las propiedades expuestas en la interfaz (`SidebarProps`), ya que modificar nombres como `currentTab` requeriría cambios en toda la aplicación.

## Decisions
**1. Alcance de Refactorización**
- *Decisión*: Sólo se modificarán constantes y funciones *internas* declaradas dentro de `Sidebar.tsx`.
- *Racional*: Garantizar el principio de menor sorpresa y adherirse a la regla lingüística del frontend sin impactar los componentes padres.

## Risks / Trade-offs
- **[Riesgo]** Errores de compilación si los mapeos no se actualizan acorde a la nueva nomenclatura.
  - **Mitigación**: Uso estricto de TypeScript (`npx tsc --noEmit`) para validar la aplicación de las nuevas variables.
