## 1. Refactorización de Transacciones (En Memoria)

- [x] 1.1 Eliminar el `fetchConManejo('/api/transactions')` de la carga inicial en el `useEffect` principal de `App.tsx`.
- [x] 1.2 Refactorizar `handleAddTransaction` en `App.tsx` para remover el `fetch('/api/transactions')` y los bloques de manejo de error de red, manteniendo solo la lógica de actualización del state `transactions`.
- [x] 1.3 Refactorizar `handleDeleteTransaction` en `App.tsx` para remover el `fetch('/api/transactions/${id}')` y el manejo de errores HTTP, dejando puramente el borrado en el state `transactions`.

## 2. Refactorización del Perfil y Eliminación de Cuenta

- [x] 2.1 Refactorizar `handleUpdateProfile` en `App.tsx` para usar el endpoint `PUT /api/v1/auth/usuarios/${oldProfile.id}` pasando el `updated` (solo enviar si `nombre` o `email` están presentes y asegurar que `localOnly` prevenga la llamada HTTP).
- [x] 2.2 Refactorizar `handleDeleteAccount` en `App.tsx` para que dispare `DELETE /api/v1/auth/eliminar?email=${userProfile.email}`.
- [x] 2.3 Añadir en el bloque `catch` de `handleDeleteAccount` la notificación de que el borrado falló, asignando un mensaje descriptivo a `errorGlobal` (útil si ocurre el error 409 del backend).
- [x] 2.4 Remover el `fetchConManejo('/api/profile')` de la carga inicial del `useEffect` principal de `App.tsx`, puesto que el perfil real ya se carga del local storage o del context del login.

## 3. Limpieza en Categorizador

- [x] 3.1 En el archivo `src/utils/categorizer.ts`, borrar el bloque `try...catch` que intenta usar `fetch('/api/categorize')` dentro de `requestAiCategorization`.
- [x] 3.2 Ajustar `requestAiCategorization` para que retorne directamente el resultado de la función síncrona `autoCategorizeDescription(description)`.
