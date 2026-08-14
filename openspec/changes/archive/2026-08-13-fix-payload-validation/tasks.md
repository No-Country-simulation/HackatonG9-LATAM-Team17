## 1. Validación de Transacciones en el Cliente

- [x] 1.1 Auditar `FormularioAnalisis.tsx` y confirmar que el mapeo de `transacciones` usa las llaves exactas `descripcion` y `valor`.
- [x] 1.2 Añadir una validación usando `Array.prototype.find` o `.some` justo antes de que empiece la petición `fetch` en `handleSubmitAnalysis`, verificando que `descripcion.trim()` no esté vacío y `valor > 0`.
- [x] 1.3 Mostrar el error con `setValidationError` y abortar la función (`return`) si se encuentra un elemento inválido en el arreglo.
