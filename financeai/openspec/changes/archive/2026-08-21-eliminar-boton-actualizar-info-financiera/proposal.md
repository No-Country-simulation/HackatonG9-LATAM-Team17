## Why

El backend requiere que todos los datos financieros base (ingreso, deuda, frecuencia de ahorro) junto con los parámetros avanzados se envíen de manera íntegra y a la vez cada vez que se realiza un nuevo análisis (endpoint `POST /api/v1/finanzas/analizar`). Actualmente, en la vista de Nuevo Análisis, estos campos base están bloqueados y muestran un botón de "Actualizar Información Financiera" que redirige al perfil. Dado que el perfil ya no permite editar estos datos (solo visualizarlos estáticamente), es fundamental habilitar la edición directamente en el formulario de Nuevo Análisis y remover dicho botón.

## What Changes

- Habilitar los campos de "Ingreso Mensual Total", "Valor Total Deudas" y "Frecuencia de Ahorro" en `src/components/NewAnalysisView.tsx` quitando la restricción `disabled`.
- Pre-cargar estos campos y los indicadores avanzados con la información almacenada en el Perfil global del usuario (proveniente del `OnboardingModal` o de análisis previos), permitiendo editarlos justo antes de enviar.
- Eliminar el botón "Actualizar Información Financiera" de la sección "Información Financiera Base".
- Asegurar que la inserción de estos datos pase correctamente al request de análisis al backend.
- Eliminar la constante `tieneInformacionBase` ya que el formulario siempre debe permitir la carga manual.

## Capabilities

### New Capabilities

### Modified Capabilities
- `restriccion-campos-financieros`: Se modifica para especificar que los campos base en la vista de nuevo análisis DEBEN ser siempre editables para cumplir con la recolección de datos del endpoint de análisis, eliminando cualquier flujo que redirija al perfil.

## Impact

- `src/components/NewAnalysisView.tsx`: Eliminación de restricciones `disabled`, borrado del botón de redirección y actualización del `useEffect` para inicializar el formulario con los datos de `userProfile` en lugar de vaciarlos. No afecta la lógica de envío.
