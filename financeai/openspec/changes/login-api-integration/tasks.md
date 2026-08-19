## 1. Traducción de Nomenclatura
- [ ] 1.1 Renombrar `isRegister` a `esRegistro` y `setIsRegister` a `setEsRegistro`.
- [ ] 1.2 Renombrar `email` a `correo` y `setEmail` a `setCorreo`.
- [ ] 1.3 Renombrar `name` a `nombre` y `setName` a `setNombre`.
- [ ] 1.4 Renombrar `password` a `contrasena` y `setPassword` a `setContrasena`.
- [ ] 1.5 Renombrar `showPassword` a `mostrarContrasena` y `setShowPassword` a `setMostrarContrasena`.
- [ ] 1.6 Renombrar `rememberMe` a `recordarme` y `setRememberMe` a `setRecordarme`.
- [ ] 1.7 Renombrar `handleSubmit` a `manejarEnvio`.

## 2. Preparación de Peticiones a API
- [ ] 2.1 Agregar estado `cargandoApi` con valor inicial `false`.
- [ ] 2.2 Agregar estado `errorApi` de tipo `string | null` con valor inicial `null`.
- [ ] 2.3 Refactorizar `manejarEnvio` para que sea una función `async`.

## 3. Lógica de Peticiones a API (POST)
- [ ] 3.1 Dentro de `manejarEnvio`, limpiar `errorApi` y establecer `cargandoApi` en `true`.
- [ ] 3.2 Determinar el endpoint: `/api/v1/auth/registro` si `esRegistro` es true, sino `/api/v1/auth/login`.
- [ ] 3.3 Configurar el cuerpo de la petición (JSON) según el endpoint (incluir `nombre` solo si es registro, `email` mapeado desde `correo` y `password` mapeado desde `contrasena`).
- [ ] 3.4 Manejar la respuesta del `fetch`. Si la respuesta es error, extraer el mensaje y setearlo en `errorApi`.
- [ ] 3.5 Si es exitosa, si es login leer el DTO e invocar `onLoginSuccess` (usando el nombre recibido o un fallback), si es registro usar los datos ingresados para llamar `onLoginSuccess`. 
- [ ] 3.6 Desactivar `cargandoApi` en la cláusula `finally` y cerrar el modal.

## 4. Ajustes Visuales
- [ ] 4.1 Modificar el botón de submit para mostrar "Cargando..." cuando `cargandoApi` es `true`, o mantener un `<Activity className="w-4 h-4 animate-spin"/>`.
- [ ] 4.2 Deshabilitar (`disabled={cargandoApi}`) los inputs y botones durante la carga.
- [ ] 4.3 Renderizar el mensaje de `errorApi` debajo del formulario usando un diseño coherente con los colores (ej. texto `#ef4444`).
- [ ] 4.4 Verificar compilación exitosa en TypeScript.
