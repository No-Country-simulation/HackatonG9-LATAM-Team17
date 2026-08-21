## Context

El proyecto actualmente actualiza el estado de la UI optimísticamente cuando se agregan, editan o eliminan transacciones y cuando se actualiza el perfil, pero ignora cualquier error emitido por la API, tragando las excepciones con `.catch(() => {})`. Asimismo, la carga inicial de datos (App.tsx) ignora las excepciones, impidiendo re-autenticar al usuario ante tokens expirados (401). Algunos componentes, como el Dashboard y el Historial, están utilizando la URL absoluta `http://localhost:8080` saltándose la configuración del proxy de Vite.

## Goals / Non-Goals

**Goals:**
- Centralizar el tratamiento de errores usando `manejarRespuestaError` en las mutaciones principales (App.tsx).
- Evitar mutaciones "fantasma": revertir o prevenir la actualización de estado local de React si la API falla.
- Detectar código 401 en la carga inicial y abrir el modal de inicio de sesión de forma proactiva.
- Corregir el proxy reemplazando URLs absolutas por relativas.

**Non-Goals:**
- No se crearán o modificarán endpoints en el backend.
- No se reescribirá la estructura principal de la navegación ni los componentes visuales existentes más allá de los mensajes de error.

## Decisions

1. **Estado Optimista vs. Estado Real:** 
   - Para las transacciones (`handleAddTransaction`, `handleDeleteTransaction`), se continuará usando un estado optimista para mantener la sensación de rapidez (UX), pero en caso de falla (`catch`), se revertirá el estado anterior, o en su defecto, se mostrará un "toast" o alerta global usando un estado local en `App.tsx` llamado `errorGlobal`.
2. **Carga Inicial (401 Unauthorized):** 
   - Modificaremos el `useEffect` de inicialización en `App.tsx`. Si alguna petición inicial retorna 401, forzaremos la eliminación de los datos de perfil y activaremos `setShowLoginModal(true)`.
3. **Proxy Relativo:** 
   - En `HistoryView.tsx` y `DashboardView.tsx`, se eliminarán las cadenas literales `http://localhost:8080` y `${API_BASE_URL}`. Todo apuntará a `/api/v1/finanzas/...` para que el proxy interno de Vite lo enrute.

## Risks / Trade-offs

- **[Riesgo de Regresión Visual]** → Al agregar estados de error globales en `App.tsx`, podría haber problemas de maquetación si la alerta empuja elementos hacia abajo. Se mitigará usando un "toast" flotante (absoluto/fijo) en la parte inferior o superior de la vista.
- **[Riesgo de Reversión de Estado]** → Revertir transacciones individualmente puede ser complejo si ocurren mutaciones concurrentes. Se optará por recargar la lista de transacciones (`fetch('/api/transactions')`) silenciosamente en caso de fallo crítico de sincronización como alternativa sencilla.
