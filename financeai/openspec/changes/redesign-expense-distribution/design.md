## Context

Actualmente `ReportsView.tsx` usa una barra apilada (stacked bar) para mostrar la distribución de gastos. Sin embargo, en escenarios reales de finanzas personales, una categoría como "Vivienda" o "Otros" puede acaparar el 80% del gasto, haciendo que las categorías pequeñas sean indistinguibles. Se requiere una solución visual "premium" que separe las categorías en barras individuales, donde el total gastado se indica en la cabecera, y las barras individuales representan la proporción de la categoría con respecto a la categoría de mayor gasto, no al total, para maximizar el uso del espacio horizontal.

## Goals / Non-Goals

**Goals:**
- Implementar una lista de distribución de gastos dinámica sin límite de categorías.
- Calcular el ancho de las barras basándose en `maxMonto = Math.max(...categorias.map(c => c.monto))` para aprovechar el ancho visual.
- Implementar un diseño responsive: tarjeta completa en desktop, y scroll vertical nativo en mobile.
- Implementar un estado vacío ("Aún no hay gastos registrados").

**Non-Goals:**
- Modificar el backend para agregar o quitar categorías.
- Modificar la generación del total general en la vista de reportes.
- Modificar componentes distintos a `ReportsView.tsx`.

## Decisions

1. **Cálculo del ancho dinámico**:
   - En lugar de usar `cat.porcentaje` (respecto al total) para el CSS `width`, usaremos `(cat.monto / maxMonto) * 100`.
   - Se aplicará un ancho mínimo de `6px` a cualquier barra que tenga gasto para garantizar que siempre sea visible, incluso si representa menos del 1% del máximo.

2. **Estructura del Componente**:
   - El contenedor principal se mantendrá dentro de la cuadrícula actual (lg:col-span-8).
   - Se utilizará un `div` con `max-h-[400px] overflow-y-auto custom-scrollbar` para acomodar N número de categorías sin distorsionar la altura general de la vista.

3. **Colores y Tipografía**:
   - Se continuará usando `cat.colorHex` provisto por `getColorForCategory`.
   - La tipografía usará las clases de Tailwind del proyecto (`font-mono-val` para números, `font-display` para cabeceras).

## Risks / Trade-offs

- [Risk] Excesivo número de categorías podría alargar mucho el componente en dispositivos sin hover (mobile).
  - *Mitigation*: Se aplicará `max-height` con scroll vertical (overflow-y-auto) para contener la lista independientemente de la longitud.
- [Risk] `maxMonto` puede ser 0 si la lista está vacía o tiene valores nulos.
  - *Mitigation*: Se validará `maxMonto > 0` antes de calcular los anchos, y si es 0, se mostrará el empty state o anchos de 0%.
