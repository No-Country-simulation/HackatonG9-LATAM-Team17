## Context
El componente `LoginModal.tsx` maneja la interfaz de usuario para el inicio de sesión y registro de cuentas. Hasta ahora la acción de enviar el formulario solo llamaba al prop `onLoginSuccess` de manera síncrona y simulada. El backend proporciona los endpoints `POST /api/v1/auth/login` y `POST /api/v1/auth/registro` para procesar credenciales reales. Para conectar esto de forma correcta, debemos añadir la lógica de peticiones `fetch` conservando la estética "premium" y siguiendo la nomenclatura en español del proyecto.

## Goals / Non-Goals

**Goals:**
- Conectar `LoginModal` a la API de autenticación (`/auth/login` y `/auth/registro`).
- Renombrar las variables de estado al español sin quebrar el UI.
- Añadir un estado local de "cargando" y "error" para retroalimentación visual amigable con el diseño existente.

**Non-Goals:**
- No se manejará almacenamiento seguro del JWT (token) retornado por el servidor en esta fase, más allá de simular su recepción (o delegarlo a componentes superiores si se requiere a futuro), ya que la prop actual `onLoginSuccess` solo pide nombre y correo.
- No se modificará el backend bajo ninguna circunstancia.

## Decisions

**1. Manejo del Submit (`manejarEnvio`)**
- *Decisión*: `manejarEnvio` será asíncrona (`async`). Primero identificará si `esRegistro` es true o false, y dirigirá la petición al endpoint correspondiente.
- *Racional*: Mantiene la lógica encapsulada en el componente modal y permite gestionar el estado de "Cargando" durante la petición.

**2. Estados Visuales (Feedback)**
- *Decisión*: Añadir `cargandoApi` y `errorApi`. Si `cargandoApi` es true, el botón cambiará a un texto "Cargando..." o deshabilitará el click. Si hay `errorApi`, se mostrará un texto rojo debajo de los inputs.
- *Racional*: Es esencial dar feedback al usuario cuando se hacen peticiones HTTP.

## Risks / Trade-offs

- **[Riesgo]** El `onLoginSuccess` actual espera el nombre del usuario y su correo. El endpoint `/auth/login` devuelve `{ mensaje, email, id, token }`, pero NO el nombre. 
  - **Mitigación**: Si el endpoint `/login` no retorna nombre, podemos usar una cadena por defecto o usar el mismo email como nombre en el frontend, documentándolo como una sugerencia a futuro para el backend. (El endpoint `/auth/registro` sí acepta el nombre en el _body_ pero su respuesta no lo incluye explícitamente en el DTO).

## Estados y Propiedades (React)

```typescript
// Estados modificados en LoginModal.tsx
const [esRegistro, setEsRegistro] = useState(false);
const [correo, setCorreo] = useState('alex@example.com');
const [nombre, setNombre] = useState('Alex Doe');
const [contrasena, setContrasena] = useState('••••••••');
const [mostrarContrasena, setMostrarContrasena] = useState(false);
const [recordarme, setRecordarme] = useState(true);

const [cargandoApi, setCargandoApi] = useState(false);
const [errorApi, setErrorApi] = useState<string | null>(null);
```
