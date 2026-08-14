## Why

Actualmente, al intentar enviar el formulario, el backend arroja un error `400 Bad Request` indicando que las transacciones tienen fallos de validación (`descripcion` vacía o `valor` faltante). Esto se debe a que el frontend no bloquea estrictamente los envíos si, en un estado intermedio, existe un objeto transacción que carece de estos atributos obligatorios para el `AnalisisInputDTO`. Es necesario resolverlo inmediatamente para asegurar que la API reciba datos íntegros.

## What Changes

- Verificación de la estructura enviada en `FormularioAnalisis.tsx` (claves `descripcion` y `valor`).
- Adición de un filtro o bloqueador de validación de cliente: antes de disparar el `fetch`, si alguna transacción tiene descripción en blanco o valor `<= 0`, se bloquea el formulario mostrando una alerta.

## Capabilities

### New Capabilities
- `payload-validation`: Validación profunda de la estructura de objetos en arreglos anidados (transacciones) antes de la comunicación HTTP.

### Modified Capabilities
- (None)

## Impact

- **Affected Code**: `src/components/FormularioAnalisis.tsx`.
- **UX**: Mayor visibilidad de errores de datos para el usuario final.
