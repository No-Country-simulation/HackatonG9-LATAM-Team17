## ADDED Requirements

### Requirement: Extracción de Distribución Mensual (Dashboard)
El sistema DEBE calcular la distribución mensual del Dashboard utilizando exclusivamente los datos (`distribucionCategorias`) del reporte de análisis más reciente dentro del mes en curso, en lugar de sumar los valores de múltiples reportes.

#### Scenario: Múltiples reportes en el mes actual
- **WHEN** existen 3 reportes generados en el mes en curso dentro de `analysisHistory`
- **THEN** la dona de distribución mensual grafica únicamente los valores del reporte más reciente (índice 0) de ese mes
- **AND** el sumatorio total ignorará los otros 2 reportes

#### Scenario: Ningún reporte en el mes actual
- **WHEN** no existen reportes para el mes en curso pero existe un reporte en la sesión actual (`report`)
- **THEN** la dona utiliza `report.distribucionCategorias`
- **AND** si `report` también es nulo, la dona muestra su estado vacío por defecto (sin romperse)

---

### Requirement: Extracción de Distribución General (ReportsView)
El sistema DEBE calcular el `totalGastado` y la `distribucionCategorias` en la vista de reportes utilizando exclusivamente el snapshot global más reciente del historial (`analysisHistory[0]`), en lugar de agregar la data de toda la vida del usuario.

#### Scenario: Visualización general con historial existente
- **WHEN** el usuario ingresa a la pestaña Reportes y posee un historial con varios análisis
- **THEN** las barras de progreso "Distribución de Gastos" se calculan en base al array `distribucionCategorias` de `analysisHistory[0]`
- **AND** la variable local `totalGastadoGeneral` es igual a `analysisHistory[0].totalGastado`

#### Scenario: Visualización del "Ahorro del Último Análisis"
- **WHEN** el usuario revisa las métricas secundarias en ReportsView
- **THEN** la tarjeta "Ahorro del Último Análisis" utiliza la misma base de cálculo (`historicalReports[0]`) garantizando que los datos sean coherentes con la gráfica principal
