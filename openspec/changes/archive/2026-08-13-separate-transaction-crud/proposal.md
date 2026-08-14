## Why

El backend ha madurado su arquitectura y ha introducido una separación estricta de responsabilidades. Actualmente, el frontend envía de forma ineficiente todo el historial de gastos dentro de cada petición de análisis. Con la llegada del `TransaccionController`, los gastos deben persistirse individualmente, permitiendo que el `AnalisisController` (que ahora actúa únicamente como motor de cierre lógico) lea los gastos previamente insertados desde la base de datos sin requerir que se retransmitan en el JSON principal.

## What Changes

- Refactorización de `SeccionIngresoGastos.tsx` y `MicroTarjetaGasto.tsx` para consumir operaciones REST independientes (`GET`, `POST`, `DELETE` en `/api/v1/transacciones/...`).
- Adaptación de las firmas de TypeScript para disociar las transacciones del RequestPayload del Análisis.
- Actualización de `FormularioAnalisis.tsx` para delegar el CRUD y emitir únicamente el evento final de disparo del Análisis con los valores base (Ingreso, Meta, Frecuencia, Deuda).
- Estandarización explícita del ID mock `USR-1001` en todas las interacciones de red.

## Capabilities

### New Capabilities
- `transaction-api-integration`: CRUD interactivo e independiente para la gestión del historial de gastos.

### Modified Capabilities
- `financial-analysis`: Desacoplamiento estructural del payload JSON principal.

## Impact

- **Affected Code**: `src/types/finance.ts`, `src/components/FormularioAnalisis.tsx`, `src/components/SeccionIngresoGastos.tsx`, `src/components/MicroTarjetaGasto.tsx`.
- **API Contracts**: Incorporación de 3 nuevos endpoints (`GET`, `POST`, `DELETE` en `/api/v1/transacciones`). Reducción de la huella de bytes enviada en `POST /api/v1/analisis/perfil`.
