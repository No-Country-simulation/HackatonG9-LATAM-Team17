# Capability: snapshot-parametros-reporte

## ADDED Requirements

### Requirement: Almacenamiento Snapshot de Entradas
El sistema SHALL almacenar los parámetros de entrada (Objetivo Presupuesto, Fondo Emergencia, Suscripciones) introducidos por el usuario dentro del propio objeto del reporte generado (`ReporteAnalisis`) al momento de completarse un análisis.

#### Scenario: Nuevo análisis generado exitosamente
- **WHEN** el usuario completa el formulario de generación en `NewAnalysisView` y la IA responde con éxito
- **THEN** el componente debe inyectar la propiedad `entradas` al objeto de reporte con los valores del estado local (ej. `objetivoPresupuesto`, `serviciosSuscripcion`, `fondoEmergencia`) antes de emitirlo vía el evento `onAnalysisComplete`.

### Requirement: Visualización Prioritaria de Snapshot en Reportes
La vista de reportes SHALL dar prioridad a los valores históricos de `entradas` del reporte por encima de los valores globales del perfil del usuario para asegurar la integridad de la visualización en el tiempo.

#### Scenario: Visualización de un reporte que cuenta con historial de entradas
- **WHEN** un reporte renderizado en `ReportsView` cuenta con `report.entradas` (y sus sub-propiedades)
- **THEN** las tarjetas correspondientes (Obj. Presupuesto, Suscripciones, Fondo Emergencia y Frecuencia Ahorro) mostrarán estos valores específicos de ese reporte en lugar de los globales de `userProfile`.

#### Scenario: Visualización de un reporte antiguo sin historial de entradas
- **WHEN** un reporte carece de la propiedad `entradas` (undefined)
- **THEN** el sistema usará como fallback (respaldo) la información del `userProfile` global actual para asegurar que la UI no se vea rota o vacía.
