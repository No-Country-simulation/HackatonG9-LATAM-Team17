## 1. Actualización de Tipos Base
- [x] 1.1 Modificar `types.ts` para que `HealthStatus` contenga exactamente los 6 estados: `'Crítico' | 'En riesgo' | 'En observación' | 'Estable' | 'Saludable' | 'Excelente'`.

## 2. Corrección de Endeudamiento en SettingsProfileView
- [x] 2.1 En `SettingsProfileView.tsx`, crear una función `getDebtColor(ratio)` que devuelva verde para <30, naranja para <=50, rojo para >50.
- [x] 2.2 Reemplazar la lectura de `userProfile.nivelEndeudamiento` por una constante que calcule `ratioDeudaCalculado` en base a `userProfile.deudaTotal` y `userProfile.ingresoMensual`.
- [x] 2.3 Actualizar la barra de progreso estática para usar `style={{ width: \`${ratioDeudaCalculado}%\`, backgroundColor: getDebtColor(ratioDeudaCalculado) }}`.

## 3. Corrección de Endeudamiento en ReportsView
- [x] 3.1 En `ReportsView.tsx`, copiar o importar la función `getDebtColor`.
- [x] 3.2 Actualizar la barra de progreso de endeudamiento (Card 2) para utilizar `getDebtColor(userProfile.ratioDeuda || 0)` en su `backgroundColor`.

## 4. Normalización en HistoryView y Mapeadores
- [x] 4.1 En `mapeadores.ts`, agregar reglas exactas para `estadoSalud` según los 6 rangos/estados (Excelente, Saludable, Estable, En observación, En riesgo, Crítico) basándose en las probabilidades si es necesario, o garantizando que se devuelvan los 6 si vienen del backend.
- [x] 4.2 En `HistoryView.tsx` (useEffect fetchHistory), normalizar estados devueltos: si `item.perfilFinanciero === 'Observación'`, guardarlo como `'En observación'`, si es `'Riesgo'`, guardarlo como `'En riesgo'`.
- [x] 4.3 Actualizar la función `obtenerInsigniaSalud` en `HistoryView.tsx` para soportar todos los 6 estados y retornarles una etiqueta visual con su color correspondiente (Rojo intenso, Rojo, Naranja, Azul/Turquesa, Verde, Verde intenso).
- [x] 4.4 Agregar un botón extra en la zona de filtros (`Status Filter Buttons`) para cada uno de los 6 estados.

## 5. Recálculo de Salud Promedio
- [x] 5.1 En `HistoryView.tsx` (dentro de `estadisticas = useMemo`), cambiar la lógica de `avgScore`.
- [x] 5.2 Implementar los pesos por asignación: Excelente=100, Saludable=80, Estable=60, En observación=40, En riesgo=20, Crítico=0.
- [x] 5.3 Promediar los pesos y mostrar ese valor como "Salud Promedio".
