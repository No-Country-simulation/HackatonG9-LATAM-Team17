## Context

En el servidor de desarrollo, Vite corre integrado junto a un middleware de Express (`server.ts`). Este middleware intercepta todas las llamadas HTTP con `express.json()`, lo cual consume y arruina el *stream* del payload para el proxy de Vite en llamadas `POST`. Esto genera errores `SocketTimeoutException` en Tomcat ya que nunca llegan los bytes del body.
Adicionalmente, el frontend actualmente bloquea la vista montando un componente a pantalla completa (`LoginModal`) si no hay sesión (`App.tsx`), pero mantiene la URL (ej. `/historial`), lo cual rompe los paradigmas estándar de las SPA seguras. Finalmente, los botones sociales y de recuperación de contraseña son funcionales pero falsos (mockeados), y `apiErrors.ts` depende de parsing de strings de errores 500 para la autenticación en vez de los estatus correctos 401 y 409 definidos recientemente en la API del backend.

## Goals / Non-Goals

**Goals:**
- Reparar la transmisión JSON en el proxy de desarrollo configurando exclusiones en el middleware de `express.json()`.
- Migrar el "Render-Blocking modal" estático de React Router a una redirección estándar mediante `<Navigate to="/login" />`.
- Eliminar el inicio de sesión falso en `LoginModal.tsx` por motivos de seguridad y claridad.
- Depurar `apiErrors.ts` para que mapee los nuevos códigos HTTP 401 y 409 directamente.

**Non-Goals:**
- No se creará la lógica real de recuperación de contraseña ni el OAUTH2 de Google; se mostrarán alertas disuasorias.
- No se alterarán los endpoints ni reglas del backend.

## Decisions

1. **Exclusión en `server.ts`**:
   Se modificará `server.ts` para usar una función middleware de exclusión, garantizando que `express.json()` sólo se aplique a rutas que *no* comiencen con `/api`. De esta forma el proxy de Vite recibe y envía el *request raw*.
2. **Refactorización de Rutas (`App.tsx`)**:
   Se declarará el `LoginModal` dentro de su propia ruta estricta `<Route path="/login" />` (o equivalente). El control de acceso `!userProfile` ejecutará una redirección limpia en lugar de inyectar el componente.
3. **Adecuación de Errores 401 y 409**:
   Se modificará el `switch` en `apiErrors.ts` para integrar un `case 401:` que retorne "Credenciales inválidas" limpiamente, removiendo las validaciones rústicas tipo `.includes('Usuario o contraseña')` en el bloque 500.

## Risks / Trade-offs

- **[Risk]** Reestructurar el árbol de componentes principales para meter la ruta `/login` podría alterar transiciones globales de Framer Motion o forzar reflows.
- **[Mitigation]** Se implementará la lógica conservando el Layout del `BrowserRouter`, aplicando un `<Navigate to="/login" replace />` en la raíz de protección para mantener la máxima compatibilidad.
