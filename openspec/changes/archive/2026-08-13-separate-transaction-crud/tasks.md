## 1. Fase 1: Adaptar Interfaces (Tipos de TypeScript)

- [ ] 1.1 Actualizar `src/types/finance.ts` para separar responsabilidades. Eliminar la propiedad `transacciones` de la interfaz `AnalysisRequestPayload`.
- [ ] 1.2 Actualizar la interfaz de `Transaccion` (o crear `TransaccionDTO`) para incluir un campo opcional `id?: number` (requerido para el `DELETE` hacia Spring Boot).

## 2. Fase 2: Refactorizar CRUD de Gastos

- [ ] 2.1 Modificar el componente encargado del estado de los gastos para realizar una petición `GET /api/v1/transacciones/usuario/USR-1001` al montarse (usando `useEffect`), poblando el estado inicial de la lista.
- [ ] 2.2 Modificar la función de "Agregar Gasto" para que dispare un `POST /api/v1/transacciones/usuario/USR-1001` antes de actualizar la UI, manejando bloqueos de carga (loading) locales.
- [ ] 2.3 Modificar la función de "Eliminar Gasto" (que se pasa a `MicroTarjetaGasto.tsx`) para ejecutar un `DELETE /api/v1/transacciones/{id}`.
- [ ] 2.4 Comprobar que en todos los `fetch` de esta fase se utilice el identificador de usuario `USR-1001` explícitamente y se manejen correctamente los errores de conectividad (mostrando mensaje o alert).

## 3. Fase 3: Actualizar Disparador del Análisis

- [ ] 3.1 Auditar `FormularioAnalisis.tsx` y remover la validación lógica que comprobaba si el arreglo local de transacciones estaba vacío antes de poder enviar el análisis. (El backend ahora validará la existencia en BD).
- [ ] 3.2 Eliminar la inclusión de la lista de gastos en el cuerpo (`body`) del `fetch` de `handleSubmitAnalysis`.
- [ ] 3.3 Validar que el botón principal de análisis invoque exclusivamente al endpoint `/api/v1/analisis/perfil/USR-1001` con los datos macro base intactos.
