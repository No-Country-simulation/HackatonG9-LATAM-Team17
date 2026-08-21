## Purpose
TBD: Este spec define la consistencia de los tipos de análisis devueltos por el backend.

## Requirements

### Requirement: Consistencia del modelo ReporteAnalisis
El sistema SHALL definir el tipo `ReporteAnalisis` sin incluir propiedades que no sean emitidas por los endpoints de historial o de análisis del backend, garantizando una compatibilidad estricta de tipos.

#### Scenario: Interfaz sin campos espurios
- **WHEN** se mapean respuestas del servidor o datos locales hacia un objeto `ReporteAnalisis`
- **THEN** no se exigirá el campo `logroSemanal`, previniendo errores de compilación de TypeScript o la necesidad de mockear datos faltantes.
