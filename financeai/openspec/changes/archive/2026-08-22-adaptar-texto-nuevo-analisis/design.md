## Context

Actualmente el componente `NewAnalysisView.tsx` muestra un texto de apoyo ("Sidecard 2") que dice: "¡Ya casi! Agregar entradas manuales mantiene tu historia precisa. Cada detalle ayuda a pintar una mejor imagen de tus metas."
Este texto sugiere que las entradas manuales están modificando un historial persistente localmente. Sin embargo, en el diseño actual, este panel es una bandeja temporal donde los gastos se agrupan en lote para ser enviados al backend para análisis y categorización conjunta. 

## Goals / Non-Goals

**Goals:**
- Actualizar el texto del componente "Sidecard 2" en `NewAnalysisView.tsx` para reflejar con precisión que las transacciones se envían en bloque al Experto Financiero (IA).

**Non-Goals:**
- No se modificará el comportamiento del envío de datos, los componentes o el CSS (excepto tal vez ajustar ligeramente tamaños si el texto es distinto, pero se usará el mismo componente existente).

## Decisions

- **Nuevo Texto:** "¡Ya casi! Reúne tus gastos recientes aquí. Al generar tu análisis, nuestra inteligencia artificial los categorizará en lote y actualizará tus perspectivas financieras."
- Se mantiene el uso del ícono/mascota actual (`MASCOTS.happyPotatoCoin`) porque el componente sigue siendo de motivación.

## Risks / Trade-offs

- Ninguno. Es un cambio puramente estético y de copy en el frontend.
