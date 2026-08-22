# Capability: metricas-endeudamiento

## ADDED Requirements

### Requirement: Cálculo del Nivel de Endeudamiento
El sistema SHALL calcular y visualizar el Nivel de Endeudamiento basándose en la fórmula `(deudaTotal / ingresoMensual) * 100` y conectarlo a la interfaz en lugar de leer una variable estática indefinida.

#### Scenario: Visualización del endeudamiento en Configuración
- **WHEN** el usuario navega a Perfil -> Parámetros Financieros
- **THEN** observa su porcentaje de endeudamiento actualizado según su ingreso y deuda total guardada.

### Requirement: Colores Semáforo en la Barra de Endeudamiento
El sistema SHALL teñir la barra de progreso de endeudamiento con un color dinámico según la criticidad del ratio: <30% Verde, 30-50% Naranja, >50% Rojo.

#### Scenario: Endeudamiento Saludable
- **WHEN** el ratio de deuda del usuario es menor a 30%
- **THEN** la barra de progreso en Settings y Reports se pinta de color Verde (`#10b981`).

#### Scenario: Endeudamiento de Riesgo
- **WHEN** el ratio de deuda del usuario es mayor a 50%
- **THEN** la barra de progreso en Settings y Reports se pinta de color Rojo (`#ba1a1a`).
