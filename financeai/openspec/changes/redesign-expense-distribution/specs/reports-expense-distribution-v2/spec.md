## ADDED Requirements

### Requirement: Renderizado Dinámico de Categorías
El sistema SHALL mostrar todas las categorías registradas en el periodo sin límite estricto de ítems.

#### Scenario: Visualización de lista extensa
- **WHEN** el usuario tiene más de 8 categorías registradas en el periodo.
- **THEN** el sistema renderizará todas las filas dentro de un contenedor con scroll vertical (overflow).
- **THEN** la estructura general de la página (encabezado) permanecerá fija y no se deformará.

### Requirement: Cálculo Relativo del Ancho de Barra
El sistema SHALL calcular el ancho visual de cada barra individual de categoría en proporción a la categoría con el monto mayor, garantizando una comparación relativa.

#### Scenario: Comparación de montos dispares
- **WHEN** la categoría "Vivienda" tiene $1000 y "Suscripciones" tiene $100
- **THEN** la barra de "Vivienda" ocupará el 100% del ancho disponible en su fila respectiva.
- **THEN** la barra de "Suscripciones" ocupará el 10% del ancho disponible en su fila respectiva.
- **THEN** debajo del nombre de la categoría, el texto seguirá mostrando el porcentaje real respecto al total general de gastos.

### Requirement: Ancho Mínimo Visible
El sistema SHALL garantizar que cualquier categoría con monto mayor a 0 sea visible, incluso si su proporción relativa es diminuta.

#### Scenario: Categoría con monto ínfimo
- **WHEN** una categoría representa menos del 1% del monto máximo (ej. $1 frente a $1000).
- **THEN** la barra horizontal correspondiente tendrá un ancho mínimo de visualización de 6px.

### Requirement: Estado Vacío de Distribución
El sistema SHALL mostrar un mensaje de estado cuando no existan gastos que reportar en la ventana temporal seleccionada.

#### Scenario: Sin gastos
- **WHEN** `distribucionCategoriasTotal` está vacío o la sumatoria de gastos es 0.
- **THEN** el sistema mostrará un estado vacío con el mensaje "Aún no hay gastos registrados."
