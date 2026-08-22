## Context

El frontend debe pintar barras de progreso y gráficas de pastel/barras distribuyendo los gastos por categoría. Actualmente, existen diccionarios estáticos como `COLORES_CATEGORIA` en `mapeadores.ts` y en `DashboardView.tsx`. Cuando el backend devuelve una categoría que no está en la lista, se asigna un color gris, empobreciendo la estética.

## Goals / Non-Goals

**Goals:**
- Asegurar que cualquier categoría devuelta por el backend tenga un color único.
- Asegurar que los colores no cambien aleatoriamente en cada renderizado de React (persistencia en sesión).
- Mantener una paleta de colores vibrantes y premium.

**Non-Goals:**
- No se persistirán los colores en el backend ni en la base de datos (se guardarán localmente para mantener la consistencia durante la sesión del usuario).

## Decisions

- **Color Manager Module:** Se creará un módulo `src/utils/colorManager.ts` que exportará una función `getColorForCategory(category: string): string`.
- **Manejo de Estado:** El gestor de colores tendrá un mapa en memoria (y opcionalmente respaldado en `localStorage`) que asocie `Record<string, string>`. Si la categoría ya tiene color asignado, lo devuelve. Si no, toma el siguiente de una lista de `PALETA_BASE`.
- **Golden Ratio Fallback:** Si se agota la `PALETA_BASE`, el gestor generará un color HSL iterando sobre la proporción áurea (`hue = (lastHue + 137.5) % 360`) para garantizar colores muy distintos visualmente.

## Risks / Trade-offs

- [Risk] Colores no persistentes entre dispositivos → Al ser generados en el frontend, si el usuario entra en móvil podría ver "Mascotas" de color azul, y en PC de color verde. Mitigation: Usamos una `PALETA_BASE` predefinida que se asigna en orden de aparición. Como las categorías más comunes siempre aparecen primero y en el mismo orden, el 99% de las veces tendrán los mismos colores. Además, es un detalle estético que no afecta el funcionamiento.
