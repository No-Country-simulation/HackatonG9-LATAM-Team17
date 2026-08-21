## ADDED Requirements

### Requirement: Ausencia de Mocks en Inicialización
La aplicación NO DEBE inyectar datos ficticios (como transacciones o puntajes falsos) en los estados de inicialización de react. Los datos deben comenzar como nulos o arreglos vacíos.

#### Scenario: Nuevo usuario sin datos
- **WHEN** un usuario recién registrado entra al Dashboard
- **THEN** los indicadores como puntaje de salud deben reflejar un estado nulo o predeterminado para usuarios nuevos, y la lista de transacciones debe mostrar el Empty State en lugar de datos inventados.

### Requirement: Empty States para Dashboard y Reportes
Si el usuario no tiene un `currentReport` (nulo) o `transactions` (lista vacía), el UI DEBE adaptarse para invitar al usuario a ingresar datos, sin causar errores en tiempo de ejecución.

#### Scenario: Visualización del Dashboard sin Reportes
- **WHEN** el usuario accede al Dashboard pero no tiene reportes generados previos
- **THEN** las tarjetas de Recomendaciones o Distribución de Gastos deben informar amigablemente que se requiere un análisis inicial, ocultando los gráficos que dependan de datos ausentes.
