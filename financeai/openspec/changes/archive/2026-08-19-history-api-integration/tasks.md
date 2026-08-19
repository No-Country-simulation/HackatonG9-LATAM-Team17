## 1. Traducción de Variables de Estado Local
- [x] 1.1 Cambiar `searchQuery` por `busqueda` y `setSearchQuery` por `setBusqueda`.
- [x] 1.2 Cambiar `statusFilter` por `filtroSalud` y `setStatusFilter` por `setFiltroSalud`.
- [x] 1.3 Cambiar `sortBy` por `ordenarPor` y `setSortBy` por `setOrdenarPor`.
- [x] 1.4 Cambiar `filteredHistory` por `historialFiltrado`.
- [x] 1.5 Cambiar `stats` por `estadisticas`.
- [x] 1.6 Cambiar `totalScore` y `totalSpent` por `puntajeTotal` y `gastoTotal` respectivamente, dentro del cálculo.
- [x] 1.7 Cambiar `getStatusBadge` por `obtenerInsigniaSalud`.

## 2. Inicialización de Conexión a la API
- [x] 2.1 Agregar estado local `historialLocal` inicializado con `analysisHistory`.
- [x] 2.2 Agregar estado `cargandoHistorial` inicializado en verdadero.
- [x] 2.3 Importar (o crear) constante `API_BASE_URL` apuntando a `http://localhost:8080`.
- [x] 2.4 Agregar un `useEffect` que haga un fetch a `GET /api/v1/finanzas/historial` cuando el componente monte.

## 3. Mapeo y Manejo de Datos de API
- [x] 3.1 Capturar la respuesta JSON de la API. Si falla, el `catch` dejará `historialLocal` con el prop `analysisHistory` intacto.
- [x] 3.2 Iterar sobre el array devuelto y mapearlo al tipo `ReporteAnalisis` usando transformaciones (p.ej. calcular un puntaje basado en `perfilFinanciero`).
- [x] 3.3 Setear `historialLocal` con el nuevo array transformado si es válido.
- [x] 3.4 Apagar `cargandoHistorial` tanto en éxito como en fallo (`finally`).

## 4. Conexión de Datos al UI
- [x] 4.1 Cambiar `analysisHistory` por `historialLocal` en los `useMemo` donde se calculan `historialFiltrado` y `estadisticas`.
- [x] 4.2 Validar que el componente compila sin errores TypeScript.
- [x] 4.3 Comprobar visualmente que el diseño y transiciones se mantienen exactas (cero cambios en Tailwind).
