## ADDED Requirements

### Requirement: Clasificación inteligente de transacciones rápidas
El sistema DEBE utilizar el endpoint `POST /api/v1/finanzas/clasificar` para determinar la categoría de una nueva transacción ingresada a través de la sección "Quick Add" (Transacción Rápida) del Dashboard, reemplazando la dependencia exclusiva de la función local `autoCategorizeDescription`. Dado que la API requiere el parámetro `valor`, la clasificación en vivo (mientras el usuario escribe la descripción) seguirá usando el categorizador local como *fallback*, y la clasificación final vía API se ejecutará al enviar el formulario (cuando tanto la descripción como el monto están disponibles).

#### Scenario: Clasificación exitosa al enviar transacción
- **WHEN** el usuario ingresa una descripción y un valor y hace clic en "Agregar"
- **THEN** el sistema envía una petición a `/api/v1/finanzas/clasificar` con la descripción y el valor
- **THEN** si la respuesta es exitosa, el sistema asume la categoría devuelta (`resumen_gastos`) y agrega la transacción con estado auto-categorizado = true.

#### Scenario: Fallo en la clasificación por la API
- **WHEN** la API `/api/v1/finanzas/clasificar` falla o devuelve un error
- **THEN** el sistema utiliza la categoría determinada por el categorizador local como *fallback*
- **THEN** el sistema agrega la transacción usando la categoría de fallback e indica si falló la categorización.

### Requirement: Renombramiento de estado al español en DashboardView
El sistema DEBE utilizar nombres de variables en español (`camelCase`) para el estado interno relacionado con el "Quick Add" y otros controles en el `DashboardView`.

#### Scenario: Interacción con inputs de transacción rápida
- **WHEN** el usuario interactúa con los inputs de "Quick Add"
- **THEN** los valores se almacenan y procesan usando las variables de estado `descripcionRapida`, `valorRapido`, `categoriaRapida`, `modeloFallo`, etc., en lugar de sus equivalentes en inglés.
