## Context
El componente `ReportsView` recibe información analítica (proveniente del backend de finanzas) mediante la propiedad `report: ReporteAnalisis` y `userProfile: UserProfile`. Sin embargo, muchas áreas de la UI mantienen datos estáticos hardcodeados en lugar de pintar dinámicamente el resultado originado por el endpoint. Debemos realizar esta conexión de los datos y traducir el estado a español.

## Goals / Non-Goals
**Goals:**
- Traducir `selectedPeriod`, `isExporting`, etc., a español.
- Usar `report.distribucionCategorias` para renderizar la sección de Distribución de Gastos (tanto la gráfica visual como la leyenda lateral y las etiquetas inferiores).
- Mapear las 4 métricas secundarias ("Ahorro Total", "Obj. Presupuesto", "Suscripciones", "Fondo Emergencia") a valores reales de `userProfile` (para Presupuesto, Suscripciones, Emergencia) o de `report` (para Ahorro).
- Preservar escrupulosamente el diseño de UI de TailwindCSS de esta sección.

**Non-Goals:**
- No se agregará lógica de petición `fetch` dentro del componente `ReportsView.tsx` ya que su arquitectura y propósito es de presentación (toma datos de su contenedor padre que ya se comunica con el backend).
- No se modificará el CSS base ni los íconos de la interfaz gráfica.

## Decisions

**1. Mapeo de la Gráfica de "Distribución de Gastos"**
- *Decisión*: Reemplazaremos el array `categories` hardcodeado. Para la barra principal dividida (que suma porcentajes), iteraremos dinámicamente sobre `report.distribucionCategorias` mapeando el `colorHex` y el `porcentaje`.
- *Racional*: Es la forma natural de visualizar el objeto anidado en el JSON que el backend devuelve y que `ReporteAnalisis` tipifica.

**2. Formateo de Moneda**
- *Decisión*: Se utilizará `toLocaleString('en-US')` para dar un formato consistente a las cifras mapeadas de `report` y `userProfile`.
- *Racional*: Mantiene el aspecto profesional y estético del prototipo actual.

## Risks / Trade-offs
- **[Riesgo]** Posible desaparición o mal visualización de la barra de porcentajes si `report.distribucionCategorias` viene vacío del backend.
  - **Mitigación**: Se usará un bloque condicional que verifique si el array existe y tiene elementos. En caso negativo, mostrará un mensaje amigable integrado en el diseño indicando "No hay suficientes datos para graficar".
