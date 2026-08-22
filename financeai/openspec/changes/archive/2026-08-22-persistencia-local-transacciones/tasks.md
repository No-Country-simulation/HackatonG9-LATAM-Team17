## 1. Persistencia de Transacciones (App.tsx)

- [x] 1.1 Modificar el estado inicial de `transactions` en `App.tsx` para que lea desde `localStorage` al montar (usando inicialización lazy para evitar parpadeos).
- [x] 1.2 Agregar un `useEffect` en `App.tsx` que escuche cambios en la variable `transactions` y guarde el arreglo actualizado en `localStorage`.

## 2. Limpieza Post-Análisis (App.tsx / NewAnalysisView.tsx)

- [x] 2.1 Identificar el bloque de éxito (200 OK) de la petición `POST /api/v1/finanzas/analizar` en `App.tsx` (función `handleAnalisisSubmit` o similar).
- [x] 2.2 Agregar la instrucción `setTransactions([])` en el bloque de éxito del análisis para vaciar el carrito.
- [x] 2.3 Verificar que el `useEffect` del paso 1.2 borre el localStorage correctamente cuando las transacciones pasan a ser un arreglo vacío.

## 3. Actualización de Textos (DashboardView.tsx)

- [x] 3.1 Buscar en `DashboardView.tsx` el texto "Registro de Transacciones".
- [x] 3.2 Reemplazar el texto por "Nuevos Gastos (Pendientes de Análisis)" para dar claridad al usuario.
- [x] 3.3 Revisar si existen otros textos en la misma vista que insinúen que las transacciones son definitivas y adaptarlos al nuevo enfoque temporal.
