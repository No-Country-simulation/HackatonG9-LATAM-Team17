 ## 1. Configuración de Enrutamiento (Proxy)

- [x] 1.1 Modificar `HistoryView.tsx` para cambiar la URL absoluta por `/api/v1/finanzas/historial`.
- [x] 1.2 Modificar `DashboardView.tsx` para cambiar la URL absoluta por `/api/v1/finanzas/clasificar`.

## 2. Manejo de Errores en Carga Inicial (App.tsx)

- [ ] 2.1 Refactorizar los `fetch` en el `useEffect` inicial de `App.tsx` para usar async/await y `manejarRespuestaError` en lugar de ignorar promesas.
- [ ] 2.2 Implementar lógica condicional en la carga: si algún `fetch` falla por 401, limpiar datos de usuario (`setUserProfile`) y disparar `setShowLoginModal(true)`.

## 3. Manejo de Errores en Mutaciones (App.tsx)

- [ ] 3.1 Integrar estado visual global: agregar componente simple tipo "Toast" o Alert flotante en el layout de `App.tsx` (ej. `errorGlobal`, `setErrorGlobal`).
- [ ] 3.2 Refactorizar `handleAddTransaction`: si la promesa falla, usar `setErrorGlobal` con el mensaje de error y eliminar la transacción recién añadida optimísticamente.
- [ ] 3.3 Refactorizar `handleDeleteTransaction`: restaurar la transacción en el listado si la promesa falla, y usar `setErrorGlobal`.
- [ ] 3.4 Refactorizar `handleUpdateProfile`: mostrar un error en el toast si falla, y opcionalmente volver a pedir el perfil desde la API.

## 4. Pruebas y Validación Manual

- [x] 4.1 Simular fallo en mutación (desconectar backend o mock error) para ver revertir el estado en `App.tsx` (Dashboard/Transacciones).
- [x] 4.2 Simular expiración de sesión (borrar token si existe, o forzar backend a retornar 401) y verificar que se abra el `LoginModal` en la recarga de la página.
