## 1. Actualización de Tipos Base (TypeScript)

- [x] 1.1 Modificar `src/types.ts` (o donde resida la interfaz original) para renombrar `AnalysisReport` a `ReporteAnalisis`.
- [x] 1.2 Traducir al español todas las propiedades internas manteniendo `camelCase` (ej. `healthScore` -> `puntajeSalud`, `categoryDistribution` -> `distribucionCategorias`).
- [x] 1.3 Exportar las interfaces auxiliares como `DistribucionCategoria` y `SugerenciaAccion`.

## 2. Creación del Mapeador Frontend

- [x] 2.1 Crear el archivo `src/utils/mapeadores.ts`.
- [x] 2.2 Implementar la función `mapearAnalisisOutputDTO` que reciba el objeto plano de la API.
- [x] 2.3 Añadir lógica dentro del mapeador para inyectar colores y calcular porcentajes para las categorías basándose en el campo `resumen_gastos`.
- [x] 2.4 Añadir lógica dentro del mapeador para estructurar las recomendaciones como objetos `SugerenciaAccion` asignando `tipoEstado` e `impacto` simulados.

## 3. Integración en el Modal

- [x] 3.1 Actualizar `src/components/AnalysisDetailModal.tsx` para importar `ReporteAnalisis`.
- [x] 3.2 Cambiar la prop principal de `report` a `reporte`.
- [x] 3.3 Reemplazar todas las referencias en el JSX para que usen las propiedades en español (ej. `reporte.puntajeSalud`, `reporte.distribucionCategorias.map(...)`).
- [x] 3.4 Validar que no haya clases de TailwindCSS rotas ni se pierda ninguna animación `framer-motion` durante el reemplazo de variables.

## 4. Corrección de Datos Mockeados y Componentes Padre

- [x] 4.1 Identificar en el repositorio dónde se declaran los datos falsos que alimentan el modal actualmente (ej. historias de reportes).
- [x] 4.2 Actualizar las llaves de esos objetos mock para que cumplan con la nueva interfaz `ReporteAnalisis`.
- [x] 4.3 Actualizar el componente padre (Dashboard o History) para que inyecte `reporte` correctamente en el Modal.
