## Clasificación de componentes existentes por dominio

Basado en la lectura de los archivos `code.html` y la responsabilidad funcional actual:

1. **`TarjetaDiagnostico.tsx`** -> Pertenece al dominio **`analisis`**. Se encarga de visualizar el "Perfil Financiero" (probabilidad, etc.) en el Dashboard General.
2. **`TarjetaRecomendacion.tsx`** -> Pertenece al dominio **`analisis`**. Se encarga de visualizar las "Recomendaciones del Experto" en el Dashboard General.
3. **`MicroTarjetaGasto.tsx`** -> Pertenece al dominio **`transacciones`**. Representa la unidad atómica de un gasto (CRUD de entradas).
4. **`SeccionIngresoGastos.tsx`** -> Pertenece al dominio **`transacciones`**. Agrupa la interfaz de entrada y la tabla de "Entradas Actuales" en la pantalla de Nuevo Análisis.
5. **`FormularioAnalisis.tsx`** -> **Ambiguo / Integrador**. Técnicamente su objetivo final es disparar el análisis (`POST /api/v1/analisis/perfil`), lo que lo acercaría al dominio `analisis`. Sin embargo, renderiza y orquesta a `SeccionIngresoGastos` (dominio `transacciones`) y estructura toda la grilla de la pantalla (actuando casi como una `Page` en Next.js). No se clasifica por defecto en un solo feature sin antes extraer sus responsabilidades compartidas.

## Estructura destino propuesta

```text
src/
  features/
    analisis/
      components/
      hooks/
      api/
      types.ts
    transacciones/
      components/
      hooks/
      api/
      types.ts
    shared/
      components/     # Elementos UI base (botones, modales) o layouts genuinamente reusables
      styles/         # CSS/tokens extraídos de ambos DESIGN.md ("The Encouraging Expert")
```
*(Nota: `src/types/finance.ts` permanecerá intacto por el momento, aunque eventualmente sus interfaces se dividirán hacia los `types.ts` de cada feature).*

## Preservación del diseño CSS

Ambos `DESIGN.md` definen la misma identidad visual ("The Encouraging Expert" - Indigo/Coral, tipografías Plus Jakarta Sans, Inter, JetBrains Mono). 
- El sistema de colores de Tailwind y las utilidades CSS compartidas (`.interactive-card`, `.custom-shadow`) presentes en las etiquetas `<style>` y `<script>` de los `code.html` se centralizarán en `src/features/shared/styles/` (ya sea en el `tailwind.config.ts` o `globals.css`). 
- **Ningún valor de la guía de estilos será alterado.** Las clases utilitarias (`p-[24px]`, etc.) se mantienen exactamente igual en los componentes movidos.

## Preservación de la lógica de conexión

**Se confirma explícitamente que el flujo de navegación se mantiene intacto.** 
La reorganización es estrictamente a nivel de estructura de directorios e `imports`. La lógica actual donde el usuario llena el formulario en la pantalla "Nuevo Análisis", dispara el POST, y transita la información al estado del Dashboard General para renderizar las tarjetas, no sufrirá alteraciones en sus ciclos de renderizado en React.

## Inconsistencias detectadas

- **Componentes actuando como Páginas:** `FormularioAnalisis.tsx` incluye el `<aside>` (Sidebar) y el `<header>` (TopAppBar) copiados del diseño `code.html`. En una arquitectura limpia por features, los layouts (navbars, sidebars) deberían estar en `shared/components/layout` o en `src/app/layout.tsx`, en vez de anidados dentro del componente del formulario. (No lo refactorizaremos en este change, pero se reporta).
