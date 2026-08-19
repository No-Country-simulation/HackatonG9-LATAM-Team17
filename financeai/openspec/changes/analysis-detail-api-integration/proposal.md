## Why

El objetivo es integrar la vista de `AnalysisDetailModal.tsx` con los datos reales provenientes de la API REST de Java Spring Boot (`/api/v1/finanzas/analizar` o `/api/v1/finanzas/historial`), respetando la restricción de **no modificar los endpoints backend actuales** y manteniendo **completamente intacto el diseño premium actual del modal**. 
Debido a que el backend retorna campos en formato simple (ej. `resumen_gastos` como un mapa clave-valor y `recomendaciones` como un arreglo de strings), el frontend requiere una capa de adaptación (mapeo) para alimentar la interfaz sin romper la estructura requerida por React.

## User Review Required

**⚠️ ADVERTENCIA: Cambio de idioma y nombres de variables**
Siguiendo las reglas de "Convenciones de Nomenclatura", el modelo de datos de esta sección debe pasarse a español y usar `camelCase`. Actualmente, `AnalysisDetailModal.tsx` utiliza propiedades en inglés como `healthScore`, `encouragingMessage`, `categoryDistribution`, etc. 
Para alinearnos con el backend, se propone renombrarlos al español (`puntajeSalud`, `mensajeMotivador`, `distribucionCategorias`). ¿Apruebas este renombramiento en los tipos de TypeScript o prefieres mantener el frontend en inglés y hacer el mapeo internamente en el momento de asignar las propiedades al modal? (Recomendamos mapearlo al español).

## What Changes

- Creación de un transformador/mapeador en el frontend que tome el `AnalisisOutputDTO` (backend) y lo convierta a la estructura enriquecida que usa el `AnalysisDetailModal.tsx`.
- Generación local de datos visuales que el backend no proporciona (por ejemplo: asignación de colores para las categorías, cálculo de porcentajes basado en el `resumen_gastos`, y estructuración del objeto de recomendaciones).
- Aplicación de las reglas de convención al español (si es aprobado por el usuario).
- **No habrá cambios en el backend.**
- **No habrá cambios visuales en el diseño del Modal.** Todo seguirá usando TailwindCSS con colores vibrantes y micro-animaciones existentes.

## Capabilities

### New Capabilities
- `analysis-modal-integration`: Adaptación y mapeo del DTO de finanzas (`AnalisisOutputDTO`) para inyectarse de forma segura en `AnalysisDetailModal.tsx` sin alterar su renderizado visual ni diseño.

### Modified Capabilities

## Impact

- `src/components/AnalysisDetailModal.tsx` (modificación en tipado si se acepta cambio de idioma, o en su defecto los componentes que le pasen el estado).
- `src/types.ts` (modificación de la interfaz `AnalysisReport` a español si se acepta).
- Integración pura en frontend mediante `mocks` complementarios para la data puramente visual que no viaja desde el backend.

## Sugerencias Futuras (Backend)
Actualmente, el backend entrega `recomendaciones` como un `List<String>`. Para una futura versión, se sugiere que el backend entregue un arreglo de objetos estructurados (`id`, `titulo`, `descripcion`, `impacto`, `nivelDeRiesgo`) y un detalle extendido de categorías (`colorHex`, `porcentaje`) para evitar que el frontend asuma lógica de negocio al renderizar el modal.
