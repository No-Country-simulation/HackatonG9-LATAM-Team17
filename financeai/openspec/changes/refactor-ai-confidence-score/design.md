## Context

El frontend actualmente utiliza los términos "Salud Financiera" (`puntajeSalud`, `estadoSalud`) para representar datos del modelo de IA que el backend denomina `probabilidad` y `perfil_financiero`. Esto causa una severa interferencia semántica en la UI, donde el porcentaje de confianza del modelo se confunde con una calificación del usuario. Es necesario erradicar la palabra "Salud" del dominio y alinear el modelo de datos del frontend con el backend.

## Goals / Non-Goals

**Goals:**
- Erradicar el concepto de "Salud Financiera" del código base.
- Renombrar `puntajeSalud` a `confianzaModelo`.
- Renombrar `estadoSalud` a `perfilFinanciero`.
- Separar visualmente el Perfil Financiero (ej. Estable) del Nivel de Confianza (ej. 78%) en la interfaz de usuario.
- Ajustar la lógica visual dependiente del porcentaje (ej. la expresión de la mascota del modal) para que evalúe `perfilFinanciero`.

**Non-Goals:**
- Modificar el backend para que devuelva campos de metadatos adicionales.
- Rediseñar el layout de los componentes afectados más allá de ajustar etiquetas y separaciones de texto.

## Decisions

- **Refactorización de Tipos**: En `src/types.ts`, `ReporteAnalisis` cambiará `puntajeSalud` por `confianzaModelo` y `estadoSalud` por `perfilFinanciero`. También se actualizará el alias `EstadoSalud` a `PerfilFinanciero`. Esto forzará al compilador de TypeScript a marcar dónde se necesita actualizar el código.
- **Nueva Lógica de la Mascota**: En `AnalysisDetailModal.tsx`, se cambiará la evaluación matemática (`>= 80`) por una semántica. Se comparará el string de `perfilFinanciero` ('Saludable', 'Excelente' -> Feliz; 'Estable', 'En observación' -> Neutro/Pensativo; 'Crítico', 'En riesgo' -> Preocupado).
- **Migración In-Place**: Para evitar crasheos con historiales previamente cacheados, los componentes leerán la data haciendo fallback: `const confianza = reporte.confianzaModelo ?? (reporte as any).puntajeSalud` y `const perfil = reporte.perfilFinanciero ?? (reporte as any).estadoSalud`.

## Risks / Trade-offs

- **[Risk]** Error de compilación masiva al renombrar dos propiedades tan extendidas.
  - **Mitigación**: El uso de TypeScript facilita atrapar todos los usos en tiempo de compilación. Las modificaciones serán limitadas solo al nivel de sintaxis y etiquetas.
