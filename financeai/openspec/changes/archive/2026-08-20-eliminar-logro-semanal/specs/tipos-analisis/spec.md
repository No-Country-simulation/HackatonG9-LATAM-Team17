## ADDED Requirements

### Requirement: Consistencia del modelo ReporteAnalisis
El sistema SHALL definir el tipo `ReporteAnalisis` sin incluir propiedades que no sean emitidas por los endpoints de historial o de análisis del backend, garantizando una compatibilidad estricta de tipos.

#### Scenario: Interfaz sin campos espurios
- **WHEN** se mapean respuestas del servidor o datos locales hacia un objeto `ReporteAnalisis`
- **THEN** no se exigirá el campo `logroSemanal`, previniendo errores de compilación de TypeScript o la necesidad de mockear datos faltantes.

## REMOVED Requirements

### Requirement: Logro Semanal Obligatorio
**Reason**: La propiedad `logroSemanal` no es provista por el backend y causaba errores en el tipado e inicialización de estados.
**Migration**: Remover el campo `logroSemanal` de `src/types.ts` y limpiar cualquier referencia en componentes como `HistoryView.tsx` o `ReportsView.tsx`.
