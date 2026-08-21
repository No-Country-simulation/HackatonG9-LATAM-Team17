## ADDED Requirements

### Requirement: Conexión de Datos Reales en Informes
El sistema DEBE reemplazar cualquier valor mockeado o fijo en la vista de Informes (`ReportsView`) y alimentarla utilizando los datos financieros reales almacenados en `userProfile` (para métricas de base) y el historial de análisis `currentReport` (para resultados calculados y gráficos).

#### Scenario: Visualización del informe financiero actualizado
- **WHEN** el usuario navega a la vista de Informes.
- **THEN** los gráficos de distribución y las barras de progreso (como el nivel de endeudamiento) muestran los valores precisos correspondientes a su último análisis y configuración de perfil.
