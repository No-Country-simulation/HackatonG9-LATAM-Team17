## Context

La vista de nuevo análisis (`NewAnalysisView.tsx`) requiere que el usuario ingrese tanto sus transacciones como ciertos datos financieros para el análisis. Actualmente, se inyectan strings como `'2500000'` para inicializar los valores de los inputs. Esto debe detenerse porque en producción el sistema debe obligar a los nuevos usuarios a ingresar datos reales, y para usuarios recurrentes, bloquear la edición (redirigiendo a `SettingsProfileView.tsx`).

## Goals / Non-Goals

**Goals:**
- Validar si el usuario ya cuenta con datos básicos (`userProfile.ingresoMensual` y `userProfile.deudaTotal` definidos y mayores a 0).
- Renderizar la sección de "Información Financiera Base" como *solo lectura* si tiene datos, incorporando un botón "Actualizar Información Financiera" que avise a React Router para redirigir (o usar props/callbacks).
- Mantener los "Indicadores Financieros Avanzados" editables siempre, pero forzando validación (required).
- Eliminar los hardcodes.

**Non-Goals:**
- No se creará una funcionalidad de guardado automático desde `NewAnalysisView.tsx` hacia el perfil, eso ya existe en `SettingsProfileView.tsx`.
- No se modificarán los endpoints de backend.

## Decisions

- **Manejo de Estados de React:** 
  Se limpiarán todos los `useState(userProfile.X || 'mock')` a `useState(userProfile.X ? String(userProfile.X) : '')`.
- **Detección de Usuario Recurrente:**
  Se creará una constante `const tieneInformacionBase = userProfile.ingresoMensual !== undefined && userProfile.ingresoMensual > 0;`.
- **Renderizado Condicional (UI):**
  Si `tieneInformacionBase` es `true`, los inputs de la sección "Información Financiera Base" se mostrarán deshabilitados (`disabled` y opacidad 60%), y en la cabecera de ese bloque o al final, un botón estilo 'outline' redirigirá al componente Settings (mediante el contexto de navegación existente o prop a la App principal).
- **Redirección:**
  Si el componente `NewAnalysisView.tsx` no tiene acceso nativo a react-router para cambiar la vista, puede recibir una prop como `onNavigateToSettings?: () => void` o se asume el patrón manejado en la UI (que tiene navegación mediante un manejador global de vistas).

## Risks / Trade-offs

- Dependemos de que `userProfile` esté propagándose de forma asíncrona correctamente. 
- Si el usuario requiere hacer un cambio pequeño, forzar la navegación agrega un paso extra (fricción), pero a cambio proporciona mucha más seguridad a los datos base que alimentan múltiples cálculos.
