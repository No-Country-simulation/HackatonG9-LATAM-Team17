## ADDED Requirements

### Requirement: Sincronización de transacciones pendientes en LocalStorage
El sistema SHALL persistir cualquier transacción añadida por el usuario en el localStorage del navegador.

#### Scenario: Recuperación tras recarga
- **WHEN** el usuario recarga la aplicación
- **THEN** las transacciones agregadas previamente (y no analizadas) se restauran desde localStorage y se visualizan en la interfaz

### Requirement: Limpieza automática tras generar análisis
El sistema SHALL vaciar la lista de transacciones pendientes una vez que el usuario crea un análisis con éxito.

#### Scenario: Vaciado del carrito
- **WHEN** el usuario hace clic en "Generar Nuevo Análisis" y el backend responde con estado de éxito
- **THEN** el sistema limpia las transacciones locales y el localStorage queda vacío

### Requirement: Claridad en interfaz de la bandeja
El sistema SHALL reflejar que la sección de transacciones es un espacio temporal previo al análisis.

#### Scenario: Cambio de títulos
- **WHEN** el usuario visualiza el dashboard
- **THEN** el título de la sección se muestra como "Nuevos Gastos (Pendientes de Análisis)" u otro texto equivalente en vez del antiguo "Registro de Transacciones"
