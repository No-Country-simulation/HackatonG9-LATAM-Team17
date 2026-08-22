# Capability: adaptacion-copy-analisis

## ADDED Requirements

### Requirement: Actualización Copy Sidecard Nuevo Análisis
El componente `NewAnalysisView.tsx` SHALL presentar un texto de motivación en su "Sidecard 2" que explique claramente la funcionalidad de agrupación y análisis en lote (Bandeja temporal) en lugar de sugerir inserción manual al historial.

#### Scenario: Visualización del panel de Nuevo Análisis
- **WHEN** el usuario navega a la sección de "Nuevo Análisis"
- **THEN** observa el texto "¡Ya casi! Reúne tus gastos recientes aquí. Al generar tu análisis, nuestra inteligencia artificial los categorizará en lote y actualizará tus perspectivas financieras." junto al ícono de motivación.
