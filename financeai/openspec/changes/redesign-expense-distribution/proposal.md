## Why

El gráfico actual de barra apilada (stacked bar) en la vista de reportes presenta un problema de legibilidad: si una categoría (ej. "Otros") tiene un gasto desproporcionadamente grande, comprime visualmente a las demás categorías haciéndolas casi invisibles o difíciles de comparar. Este cambio rediseña el componente para mostrar una barra principal del 100% (total gastado) y desglosar cada categoría con su propia barra independiente, escalada respecto al monto máximo de la lista, facilitando una comparación clara y una mejor experiencia de usuario en una app financiera premium.

## What Changes

- Reemplazo del gráfico de barra apilada en `ReportsView.tsx` por un diseño de "Barra principal + Desglose de categorías individuales".
- Implementación de un cálculo de ancho dinámico basado en la categoría con mayor monto, en lugar de porcentaje del total.
- Capacidad para renderizar dinámicamente un número ilimitado de categorías (con scroll vertical para listas de más de 8 elementos).
- Implementación de estado vacío "Sin gastos registrados" y manejo de barras con ancho mínimo visible (6px).
- Mantenimiento estricto de la paleta de colores oficial mediante `getColorForCategory`.

## Capabilities

### New Capabilities
- `reports-expense-distribution-v2`: Nueva visualización de distribución de gastos con barras individuales relativas al monto máximo, soporte para cantidad ilimitada de categorías y diseño responsivo.

### Modified Capabilities

## Impact

- Modifica exclusivamente el frontend en la renderización del componente de Distribución de Gastos de `ReportsView.tsx`.
- No requiere alteraciones en la estructura de datos que envía el backend ni en la API (`/historial` o `/analizar`).
- Aumenta la robustez visual en dispositivos móviles al mantener todo en una sola columna limpia.
