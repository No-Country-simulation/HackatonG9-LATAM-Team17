## ADDED Requirements

### Requirement: Manejo de errores 401 en carga inicial
El sistema SHALL interceptar fallos en las peticiones iniciales de carga de datos (perfil, transacciones, historial) y en caso de recibir un código 401 (No Autorizado), forzar la apertura del modal de login y purgar el estado local.

#### Scenario: Token expirado o ausente
- **WHEN** la aplicación intenta cargar `/api/profile` en el `useEffect` de montaje y la API retorna 401
- **THEN** la aplicación borra el perfil del estado local y muestra `<LoginModal>`

### Requirement: Prevención de falso optimismo en mutaciones
El sistema SHALL revertir el estado o notificar un fallo global cuando una operación de mutación (agregar transacción, actualizar perfil, eliminar) falle, impidiendo que el usuario crea que el cambio persistió.

#### Scenario: Fallo al guardar nueva transacción
- **WHEN** el usuario agrega un gasto y el `fetch` al servidor falla
- **THEN** el sistema lanza una alerta global (o alerta local en caso de estar disponible) indicando que la operación falló, y recarga la lista real del servidor para asegurar la consistencia.
