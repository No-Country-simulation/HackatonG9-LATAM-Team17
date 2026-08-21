# propagacion-errores-mutaciones

**Purpose**: TBD

## ADDED Requirements

### Requirement: Propagación de fallos en mutaciones desde el padre a los hijos
El sistema SHALL propagar cualquier error o rechazo (rejection) de las funciones de mutación (`handleUpdateProfile`, `handleAddTransaction`, `handleDeleteTransaction`) expuestas por `App.tsx` hacia los componentes hijos que las invocan.

#### Scenario: Falla de actualización de perfil
- **WHEN** un componente hijo llama a `onUpdateProfile` y el servidor retorna un error (ej. 409 Conflicto)
- **THEN** la promesa retornada por `onUpdateProfile` debe ser rechazada.

#### Scenario: Prevención de falso estado de éxito
- **WHEN** un componente hijo (como `SettingsProfileView`) experimenta un rechazo de la promesa al intentar actualizar
- **THEN** el componente no debe mostrar mensajes locales de éxito ni proceder a limpiar formularios que asuman que la acción se completó satisfactoriamente.
