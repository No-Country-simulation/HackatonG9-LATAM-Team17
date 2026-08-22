## 1. Crear Color Manager

- [x] 1.1 Crear el archivo `src/utils/colorManager.ts`.
- [x] 1.2 Implementar la función `getColorForCategory` con un caché en memoria y generación dinámica basada en proporción áurea para colores infinitos.

## 2. Refactorizar Mapeadores

- [x] 2.1 En `src/utils/mapeadores.ts`, eliminar `COLORES_CATEGORIA` e importar `getColorForCategory`.
- [x] 2.2 Usar `getColorForCategory(nombreCategoria)` al mapear `DistribucionCategoria`.

## 3. Refactorizar DashboardView

- [x] 3.1 Eliminar el diccionario local `categoryColors` dentro del render de `distribucionMensual`.
- [x] 3.2 Usar el `colorHex` que ya viene en el objeto `cat` de `distribucionMensual` (mapeado previamente).

## 4. Refactorizar ReportsView

- [x] 4.1 Buscar y eliminar cualquier diccionario de colores quemado en `ReportsView.tsx`.
- [x] 4.2 Reemplazar con el `colorHex` que viene del reporte o usar `getColorForCategory`.
