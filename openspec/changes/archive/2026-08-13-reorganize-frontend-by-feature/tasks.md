*(Recordatorio: Cada tarea involucra únicamente mover archivos y actualizar imports, sin modificar lógica de React ni estado interno).*

## 1. Setup de la Estructura Base
- [x] 1.1 Crear la estructura de directorios en `src/features/`:
  - `src/features/analisis/components/`
  - `src/features/transacciones/components/`
  - `src/features/shared/styles/`
  - `src/features/shared/components/`

## 2. Reubicación del Dominio: Transacciones
- [x] 2.1 Mover `src/components/MicroTarjetaGasto.tsx` a `src/features/transacciones/components/MicroTarjetaGasto.tsx`.
- [x] 2.2 Mover `src/components/SeccionIngresoGastos.tsx` a `src/features/transacciones/components/SeccionIngresoGastos.tsx`.
- [x] 2.3 Actualizar los paths de importación dentro de `SeccionIngresoGastos.tsx` para que apunte correctamente a `MicroTarjetaGasto` y los tipos en `src/types/finance`.

## 3. Reubicación del Dominio: Análisis
- [x] 3.1 Mover `src/components/TarjetaDiagnostico.tsx` a `src/features/analisis/components/TarjetaDiagnostico.tsx`.
- [x] 3.2 Mover `src/components/TarjetaRecomendacion.tsx` a `src/features/analisis/components/TarjetaRecomendacion.tsx`.

## 4. Reubicación de Componentes Ambiguos / Integradores
- [x] 4.1 Mover `src/components/FormularioAnalisis.tsx` a `src/features/analisis/components/FormularioAnalisis.tsx`. (Aunque agrupa transacciones, su responsabilidad principal de emitir el análisis justifica su ubicación aquí temporalmente).
- [x] 4.2 Actualizar los imports en `FormularioAnalisis.tsx` para que consuma `SeccionIngresoGastos` desde `features/transacciones/components/`.

## 5. Extracción y Verificación de Estilos
- [x] 5.1 Trasladar cualquier CSS en línea global o clases base repetidas de los `code.html` (ej. `.interactive-card`, `.custom-shadow`) a un archivo centralizado (si no están ya en `globals.css`, asegurar que `globals.css` actúe como el hub en la estructura actual). *Solo estructural*.
- [x] 5.2 Actualizar las importaciones en los archivos principales de páginas (`src/app/page.tsx` o equivalentes) que consumían componentes de `src/components/`, apuntando ahora a sus respectivas rutas en `src/features/`.

## 6. Verificación de Integridad
- [x] 6.1 Ejecutar `npm run build` o `npx tsc --noEmit` para confirmar que todos los imports (especialmente hacia `src/types/finance.ts`) estén correctamente resueltos tras los movimientos.
