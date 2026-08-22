## Context

El frontend permite a los usuarios registrar transacciones que son categorizadas mediante IA y agregadas a una lista en el dashboard. Actualmente, estas transacciones solo existen en el estado local de React (`useState` en `App.tsx`), lo que significa que se pierden al recargar la página. Puesto que el backend no cuenta con endpoints CRUD para transacciones individuales (solo recibe el lote completo al analizar), se necesita una estrategia en el frontend para persistir esta "bandeja" temporal de transacciones hasta que el usuario decida enviarlas.

## Goals / Non-Goals

**Goals:**
- Persistir las transacciones pendientes en el `localStorage` del navegador.
- Sincronizar el estado `transactions` de React con los datos guardados en el `localStorage`.
- Vaciar automáticamente las transacciones locales cuando el análisis en el backend se haya creado con éxito (200 OK).
- Mejorar los copys en `DashboardView.tsx` para reflejar que la sección es una "bandeja" y no un historial inmutable.

**Non-Goals:**
- No se crearán ni solicitarán nuevos endpoints en el backend de Spring Boot.
- No se almacenarán transacciones indefinidamente tras realizar el análisis (el análisis engloba y guarda históricamente ese lote).

## Decisions

- **LocalStorage Wrapper:** Usaremos `useEffect` en `App.tsx` para inicializar el estado `transactions` desde `localStorage` al cargar, y guardarlo ante cada cambio en el estado de `transactions`. 
- **Clave de almacenamiento:** La clave usada en `localStorage` debe estar idealmente asociada al email del usuario para evitar conflictos si inician sesión diferentes usuarios en la misma máquina (ej. `financeai_txs_${email}`). Si no es posible, una genérica `financeai_pending_txs`.
- **Limpieza Post-Análisis:** En la función `handleAnalyze` (o equivalente en `App.tsx` / vista pertinente), tras la respuesta 200, ejecutaremos `setTransactions([])` que a su vez actualizará `localStorage`.

## Risks / Trade-offs

- [Risk] Pérdida de estado temporal por cambio de dispositivo → Si el usuario arma su lote de transacciones en móvil y luego va a escritorio, no las verá. Mitigation: Se informará (mediante los textos) que los nuevos gastos son "pendientes de análisis" para dejar claro su carácter no-cloud temporal.
- [Risk] Fallo de sincronización de estado → Problemas en SSR o en re-renders concurrentes. Mitigation: Se usará inicialización lazy de estado (`useState(() => localStorage.getItem(...))`) o simple `useEffect` en montaje.
