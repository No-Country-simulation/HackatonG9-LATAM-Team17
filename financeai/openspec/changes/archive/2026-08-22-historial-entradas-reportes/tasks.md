## 1. Modificación de NewAnalysisView

- [x] 1.1 Ubicar la construcción de la constante `report` dentro de `manejarGenerarAnalisis` en `src/components/NewAnalysisView.tsx`.
- [x] 1.2 Agregar al objeto `report` la propiedad `entradas` e inyectar el valor parseado de `objetivoPresupuesto`.
- [x] 1.3 Inyectar en la propiedad `entradas` de `report` el valor parseado de `fondoEmergencia`.
- [x] 1.4 Inyectar en la propiedad `entradas` de `report` el valor de `serviciosSuscripcion` y los demás campos disponibles del formulario para tener un snapshot completo.

## 2. Refactorización de ReportsView

- [x] 2.1 Actualizar la tarjeta de "Frecuencia de Ahorro" para usar `report?.entradas?.frecuenciaAhorro || userProfile.frecuenciaAhorro`.
- [x] 2.2 Actualizar la tarjeta de "Obj. Presupuesto" para usar `report?.entradas?.objetivoPresupuesto || userProfile.objetivoPresupuesto`.
- [x] 2.3 Actualizar la tarjeta de "Suscripciones" para usar `report?.entradas?.suscripciones || userProfile.suscripciones`.
- [x] 2.4 Actualizar la tarjeta de "Fondo Emergencia" para usar `report?.entradas?.fondoEmergencia || userProfile.fondoEmergencia`.
- [x] 2.5 Refactorizar `ratioDeudaCalculado` para que dependa de `report?.entradas?.deudas` y `report?.entradas?.ingresoMensual` si están disponibles, de lo contrario fallback a `userProfile`.
