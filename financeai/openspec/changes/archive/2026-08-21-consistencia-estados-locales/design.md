## Context

Tras la reciente implementación de `manejo-excepciones-mutaciones`, se integró un toast global en `App.tsx` para mostrar errores provenientes del backend al ejecutar mutaciones como actualizar el perfil o modificar transacciones. Sin embargo, el bloque `catch` en `App.tsx` "tragaba" silenciosamente la excepción.
Como resultado, componentes presentacionales (`SettingsProfileView`, `DashboardView`, `NewAnalysisView`) que disparan estas mutaciones asumen que la operación siempre es exitosa, mostrando mensajes de "éxito" locales o limpiando formularios, incluso cuando el backend retornó un error. Este falso positivo es una UX inconsistente para un entorno de producción.

## Goals / Non-Goals

**Goals:**
- Asegurar que todas las mutaciones expuestas por `App.tsx` retornen una Promesa que falle (haga throw) si la operación no fue exitosa.
- Refactorizar los componentes hijos para que usen `async/await` al invocar props de mutación.
- Garantizar que los indicadores de éxito visual (como el check verde de "¡Información Guardada!" en el perfil) solo se rendericen si la promesa se resuelve correctamente.

**Non-Goals:**
- Modificar la forma en que se muestran los errores (seguiremos usando el toast global de `App.tsx`).
- Cambiar el backend.

## Decisions

**Propagación de Excepciones:**
En `App.tsx`, las funciones `handleUpdateProfile`, `handleAddTransaction`, y `handleDeleteTransaction` se modificarán para incluir `throw e;` en su bloque `catch`. Esto permite que el error sea manejado tanto globalmente (toast) como localmente (previniendo estados de éxito falsos).
- *Alternativa considerada:* Hacer que las funciones devuelvan un booleano (`true` para éxito, `false` para fallo).
- *Por qué se descartó:* Obligaría a todos los hijos a verificar el valor de retorno. Lanzar un error (`throw`) encaja de forma más natural con `try/catch` y el flujo asíncrono actual de React.

**Tipado de Props:**
Se actualizarán las interfaces en `types/index.ts` o en las firmas locales de cada componente para tipar explícitamente `(data: T) => Promise<void>`.
```typescript
interface SettingsProfileViewProps {
  // Antes: (profile: Partial<UserProfile>) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => Promise<void>; 
}
```

**Manejo Local (`SettingsProfileView`):**
Los manejadores `manejarGuardarBasico` y `manejarGuardarFinanciero` serán `async`. Se envolverá la llamada a `onUpdateProfile` en un `try/catch`. El estado `exitoGuardado...` solo se establecerá en el bloque `try` posterior al `await`. Si falla, el bloque `catch` permanecerá vacío (o logueará el error), ya que el UI de error ya está manejado por el padre, pero evitaremos mostrar el mensaje de éxito.

**Manejo Local (`NewAnalysisView` y `DashboardView`):**
En `handleAddTransaction`, la lógica que resetea el formulario (`setDescTx('')`, `setMontoTx('')`) se moverá después del `await onAddTransaction(...)` dentro de un `try/catch`. Si la transacción falla, los inputs retendrán lo que el usuario escribió para que pueda reintentar sin perder datos.

## Risks / Trade-offs

- [Risk] Múltiples errores mostrados al mismo tiempo. → [Mitigación] El componente hijo *no* mostrará su propio error en rojo (deja eso al Toast global). El único rol del hijo es no avanzar a la fase de "éxito" si la promesa fue rechazada.
