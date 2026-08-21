## 1. Reparación del Proxy en Desarrollo (server.ts)

- [x] 1.1 Localizar `app.use(express.json({ limit: "10mb" }));` y reemplazarlo por un middleware condicional que verifique si `req.path.startsWith('/api')`. Si es verdadero, usar `next()`, de lo contrario, ejecutar `express.json()`.

## 2. Refactorización de Errores de API (apiErrors.ts)

- [x] 2.1 En el `switch (response.status)`, agregar un bloque `case 401:` que retorne un objeto `{ general: 'Credenciales inválidas.' }`.
- [x] 2.2 En el bloque `case 500:`, eliminar el código obsoleto (workaround) que busca los textos "correo electrónico ya está en uso" y "Usuario o contraseña incorrectos".

## 3. Bloqueo de Mocks Inseguros (LoginModal.tsx)

- [x] 3.1 En el botón "Continuar con Google", sustituir la llamada a `onLoginSuccess` por una invocación a `setErrorApi('El acceso con Google aún no está implementado.')`.
- [x] 3.2 En el enlace "¿Olvidaste tu contraseña?", interceptar el evento `onClick`, usar `e.preventDefault()` y ejecutar `setErrorApi('La recuperación de contraseña aún no está implementada.')`.

## 4. Ruteo Explícito (App.tsx)

- [x] 4.1 Modificar la barrera de seguridad de `if (!userProfile)` para que retorne `<Navigate to="/login" replace />` en lugar de inyectar el componente `<LoginModal />` (asegurar que esto esté dentro del contexto de un Router).
- [x] 4.2 Si `App.tsx` usa un contenedor externo para proveer el `<BrowserRouter>`, asegurarse de que la lógica de redirección ocurra donde el hook `useLocation` esté disponible. De lo contrario, registrar una ruta explícita `<Route path="/login" element={<div className="min-h-screen bg-[#f8f9fa]"><LoginModal isOpen={true} ... /></div>} />` y ajustar el Layout principal para que no cargue la UI.
