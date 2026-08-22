## Context

Actualmente `NewAnalysisView` utiliza una función auxiliar `autoCategorizeDescription` puramente del frontend para determinar a qué categoría pertenece una transacción. El backend ya provee un motor de IA a través de `/api/v1/finanzas/clasificar` que retorna con más precisión esta información (categoría en `resumen_gastos` y perfil). A la par, el Dashboard principal (`DashboardView`) carece de una forma ágil para que los usuarios puedan subir rápidamente una compra ocasional y clasificarla para que afecte su estado actual.

## Goals / Non-Goals

**Goals:**
- Conectar la entrada de transacciones en `NewAnalysisView` con `POST /api/v1/finanzas/clasificar`.
- Crear un nuevo widget de entrada de transacciones rápidas en `DashboardView`.
- Reflejar las transacciones independientes en el frontend.

**Non-Goals:**
- No modificaremos los endpoints del backend si la inyección individual de transacciones no persiste en la BD actual. Si `GET /api/v1/finanzas/historial` no expone estas transacciones de manera combinada, las manejaremos en memoria/local state y recomendaremos un endpoint CRUD para el futuro.

## Decisions

1. **Reemplazo de categorización local**:
   - En `NewAnalysisView`, la función `handleDescChange` / `handleAddTx` llamará a `/api/v1/finanzas/clasificar`. Se mapeará la primera "key" de `resumen_gastos` del payload de respuesta (`RespuestaPythonDTO`) a nuestro tipo `ExpenseCategory`.
2. **Componente 'RegistroRápido' en Dashboard**:
   - Se creará o modificará JSX dentro de `DashboardView` con campos: Descripción, Monto. Al dar "Guardar", consultará el clasificador.
3. **Persistencia y Simulación de Historial**:
   - Ya que el endpoint `/api/v1/finanzas/analizar` es el que realmente guarda en base de datos un "Análisis", pero las transacciones sueltas no tienen un endpoint POST exclusivo (aparte del clasificador, que es agnóstico), las transacciones independientes se guardarán en el estado global (`App.tsx` o localStorage si aplica) temporalmente, para que el usuario visualice el impacto en sus gráficos locales del Dashboard.

## Risks / Trade-offs

- **Risk**: Retraso de red en la clasificación (al escribir).
  - **Mitigation**: El clasificador debe invocarse on-submit (al dar clic en "+" o "Agregar") y no on-change (mientras se teclea la descripción) para no spamear el backend y ralentizar la experiencia. Mostrar un `Loader2` giratorio en el botón durante la espera.
- **Risk**: El clasificador podría devolver una categoría que no exista en el frontend type `ExpenseCategory`.
  - **Mitigation**: Implementar un fallback seguro (ej. asignar a 'Otros' si el string no hace match con las permitidas).
