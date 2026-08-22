# Capability: Frontend Mocks Cleanup

## Purpose
TBD - Refactorización técnica para eliminar peticiones HTTP a rutas que no están respaldadas por un backend, estabilizando el uso de estados locales.

## Requirements

### Requirement: Gestión Local de Transacciones
El sistema MUST manejar la adición, eliminación y carga inicial de transacciones individuales exclusivamente en la memoria del cliente (estado de React), sin realizar peticiones HTTP a endpoints ficticios (`/api/transactions`).

#### Scenario: Agregar una transacción manual
- **WHEN** el usuario agrega una transacción a través de la interfaz de `App.tsx` (ej. vía modal)
- **THEN** la transacción se añade al estado local `transactions` sin invocar ningún `fetch` a `/api/transactions`
- **AND** el panel refleja inmediatamente la nueva transacción sin lanzar errores silenciosos de parseo de JSON.

#### Scenario: Eliminar una transacción
- **WHEN** el usuario hace clic en el botón de eliminar de una transacción específica
- **THEN** la transacción se remueve del estado local `transactions` sin invocar `DELETE /api/transactions/{id}`
- **AND** la interfaz se actualiza correctamente.

### Requirement: Remoción de Categorización Fallida
El sistema MUST confiar en la heurística local o en los endpoints reales para categorizar, eliminando cualquier intento de invocar `/api/categorize`.

#### Scenario: Categorización automática solicitada
- **WHEN** el sistema solicita una sugerencia de categoría a través de `requestAiCategorization`
- **THEN** la función evalúa localmente o retorna el fallback sin intentar hacer `fetch` a `/api/categorize` para evitar golpear el fallback de Vite.
