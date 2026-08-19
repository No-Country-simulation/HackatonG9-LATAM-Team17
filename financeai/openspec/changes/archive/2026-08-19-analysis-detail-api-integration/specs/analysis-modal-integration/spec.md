## ADDED Requirements

### Requirement: Mapeo de AnalisisOutputDTO a la interfaz del Modal
El sistema DEBE recibir la estructura cruda `AnalisisOutputDTO` del backend y mapearla a la interfaz de React que alimenta el `AnalysisDetailModal`, asegurando que no falte ninguna propiedad visual exigida por el diseño.

#### Scenario: Generación de atributos visuales faltantes
- **WHEN** los datos del backend llegan sin colores ni porcentajes para la distribución de categorías
- **THEN** el mapeador del frontend calcula los porcentajes sobre el total de gastos y asigna un color predeterminado para cada categoría reconocida.

#### Scenario: Transición de idioma en las variables
- **WHEN** se construye el objeto que se pasará a `AnalysisDetailModal`
- **THEN** se aplicará la nomenclatura en ESPAÑOL requerida (ej. `puntajeSalud` en lugar de `healthScore`), forzando al modal a adaptar su tipado.

### Requirement: Estructuración de Recomendaciones
El sistema DEBE convertir la lista simple de strings de recomendaciones del backend en un arreglo de objetos complejos de recomendación para la interfaz.

#### Scenario: Renderizado de sugerencias
- **WHEN** el backend entrega un arreglo `["Reduce gastos", "Ahorra"]`
- **THEN** el mapeador convierte cada string en un objeto con `impacto` y `nivelDeRiesgo` predefinido para mantener el diseño enriquecido de alertas.
