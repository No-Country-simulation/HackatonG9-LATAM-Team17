## Context

Actualmente, cuando un usuario ingresa transacciones y genera un nuevo análisis en `NewAnalysisView.tsx`, debe introducir ciertos parámetros (Objetivo de Presupuesto, Fondo de Emergencia, Suscripciones Activas, etc). Sin embargo, el objeto devuelto por el backend (`AnalisisOutputDTO`) y convertido al tipo interno `ReporteAnalisis` omite persistir en el frontend de dónde provienen esas configuraciones específicas. 
Por otro lado, cuando el historial (u otros componentes como `ReportsView.tsx`) intentan renderizar las métricas correspondientes a esos reportes, recurren a consultar el perfil global (`userProfile`), provocando que un reporte generado hace dos meses muestre las métricas "Actuales" en lugar de las métricas que tenía el reporte en el momento exacto de generarse.

## Goals / Non-Goals

**Goals:**
- Asegurar inmutabilidad histórica para métricas clave de cada reporte (Obj. Presupuesto, Suscripciones, Fondo Emergencia).
- Preservar la estructura de datos compatible con React Router State / variables de estado, re-utilizando la propiedad `entradas` ya declarada de manera opcional en `ReporteAnalisis`.
- Brindar mecanismo fallback: si un reporte antiguo no posee `entradas`, se utilizará el `userProfile`.

**Non-Goals:**
- No actualizaremos ni sobre-escribiremos el perfil global de la aplicación (el usuario deberá ir a "Configuración" explícitamente para modificar sus datos permanentes).
- No alteraremos ni exigiremos cambios en el endpoint del Backend; se trata 100% de persistencia en el lado cliente dentro del objeto de reporte devuelto.

## Decisions

**1. Usar la propiedad `entradas` de `ReporteAnalisis`**
- *Rationale*: Ya existe en `types.ts` una propiedad opcional `entradas` diseñada para esto, pero actualmente no se llena al hacer el mapeo en `NewAnalysisView`. Añadiendo esta asignación matamos dos pájaros de un tiro sin ensuciar la interfaz `ReporteAnalisis`.

**2. Fallback lógico en `ReportsView`**
- *Rationale*: Muchos reportes guardados en sesión (o mocks previstos) no tendrán la propiedad `entradas`. Para evitar visualizaciones vacías ("$0"), los componentes leerán de forma defensiva: `report.entradas?.fondoEmergencia || userProfile.fondoEmergencia`.

## Risks / Trade-offs

- **[Risk]** Como la información se guarda del lado del cliente, al recargar la página todo el historial sin persistir en LocalStorage se borrará, y solo se recobrarán los análisis que devuelva el endpoint `/historial`. Como el endpoint del historial backend *no* devuelve los parámetros de entrada, el front recurrirá al fallback.
- *Mitigation*: Esto es aceptable en el scope del frontend actual. A futuro ("Sugerencia para versión futura"), el backend debería empezar a almacenar y devolver la configuración de variables junto a los objetos del reporte en la base de datos central. Por ahora, el comportamiento "fallback" cubrirá esta limitación elegante.
