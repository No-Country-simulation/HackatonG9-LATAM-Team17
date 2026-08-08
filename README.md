## 📡 Endpoints del **AnalisisController**

**Base Path:** `/api/v1/analisis`

***

### 1. Procesar Análisis Financiero con IA

Envía los datos financieros del usuario para que el microservicio en Python genere el perfil y análisis correspondiente.

- **URL:** `/api/v1/analisis/procesar`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Códigos de Éxito:** `201 Created`

#### Cuerpo de la Petición (`AnalisisInputDTO`)

```json
{
  "usuarioId": "USR-1001",
  "transacciones": [
    {
      "descripcion": "Supermercado compras de la semana",
      "monto": 42500.00,
      "tipo": "EGRESO",
      "categoria": "Alimentación"
    },
    {
      "descripcion": "Cobro de sueldo",
      "monto": 650000.00,
      "tipo": "INGRESO",
      "categoria": "Salario"
    }
  ]
}
```

#### Respuesta Exitosa (`AnalisisOutputDTO` - HTTP 201 Created)

```json
{
  "id": 1,
  "usuarioId": "USR-1001",
  "perfilFinanciero": "CONSERVADOR",
  "nivelRiesgo": "BAJO",
  "recomendaciones": [
    "Mantener un fondo de emergencia equivalente a 3 meses de gastos.",
    "Considerar instrumentos de bajo riesgo como Plazo Fijo o FCI."
  ],
  "fechaAnalisis": "2026-07-31T10:39:00"
}
```

#### Posibles Errores

| Código HTTP | Excepción | DTO Devuelto | Descripción | Ejemplo |
|-------------|-----------|--------------|-------------|---------|
| `400 BAD REQUEST` | `MethodArgumentNotValidException` | `ErrorResponseDTO` | Errores de validación en campos requeridos o reglas de negocio. | ```json { "timestamp": "2026-07-31T11:00:00", "status": 400, "error": "Bad Request", "message": "Errores de validación", "details": { "transacciones": "La lista no puede estar vacía", "monto": "El monto no puede ser negativo" } } ``` |
| `502 BAD GATEWAY` | `HttpStatusCodeException` | `PythonServiceErrorDTO` | El microservicio de Python retornó un error 4xx/5xx. | ```json { "timestamp": "2026-07-31T11:15:00", "status": 502, "error": "Bad Gateway", "message": "El servicio de Python retornó un error", "pythonError": { "code": "INVALID_INPUT", "detail": "El campo 'transacciones' es requerido" } } ``` |
| `503 SERVICE UNAVAILABLE` | `ResourceAccessException` | `PythonServiceErrorDTO` | No se pudo establecer conexión con el servicio de Python. | ```json { "timestamp": "2026-07-31T11:20:00", "status": 503, "error": "Service Unavailable", "message": "No se pudo conectar con el servicio de análisis", "retryAfter": 30 } ``` |
| `504 GATEWAY TIMEOUT` | `TimeoutException`, `SocketTimeoutException` | `AIServiceErrorDTO` | El servicio de IA tardó demasiado en responder (timeout de inferencia). | ```json { "timestamp": "2026-07-31T11:25:00", "status": 504, "error": "Gateway Timeout", "message": "El servicio de IA tardó demasiado en responder", "isTimeout": true, "suggestion": "Reintentar en 60 segundos" } ``` |
| `503 SERVICE UNAVAILABLE` | `AIServiceUnavailableException` | `AIServiceErrorDTO` | Error interno del motor de IA (Out of Memory, falta de GPU, etc.). | ```json { "timestamp": "2026-07-31T11:30:00", "status": 503, "error": "Service Unavailable", "message": "El motor de IA no está disponible temporalmente", "isTimeout": false, "suggestion": "Contactar soporte si persiste" } ``` |
| `500 INTERNAL ERROR` | `Exception` | `ErrorResponseDTO` | Error interno no controlado del servidor. | ```json { "timestamp": "2026-07-31T11:35:00", "status": 500, "error": "Internal Server Error", "message": "Error interno del servidor. Contactar soporte." } ``` |

***

### 2. Registrar Transacción Individual

Permite la carga puntual de una transacción en la base de datos.

- **URL:** `/api/v1/analisis/transacciones`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Códigos de Éxito:** `201 Created`

#### Payload de Entrada (`TransaccionDTO` - Request Body)

```json
{
  "descripcion": "Pago de servicio de luz",
  "monto": 24500.00,
  "tipo": "EGRESO",
  "categoria": "Servicios"
}
```

#### Respuesta Exitosa (`TransaccionResponseDTO` - HTTP 201 Created)

```json
{
  "id": 3,
  "usuarioId": "USR-DEFAULT",
  "monto": 24500.00,
  "tipo": "EGRESO",
  "descripcion": "Pago de servicio de luz",
  "categoria": "Servicios",
  "fechaTransaccion": "2026-07-31T10:52:00"
}
```

#### Posibles Errores

| Código HTTP | Excepción | DTO Devuelto | Descripción | Ejemplo |
|-------------|-----------|--------------|-------------|---------|
| `400 BAD REQUEST` | `MethodArgumentNotValidException` | `ErrorResponseDTO` | Errores de validación en campos requeridos o reglas de negocio. | ```json { "timestamp": "2026-07-31T11:00:00", "status": 400, "error": "Bad Request", "message": "Errores de validación", "details": { "monto": "El monto no puede ser negativo", "tipo": "El tipo debe ser INGRESO o EGRESO" } } ``` |
| `409 CONFLICT` | `DataIntegrityViolationException` | `DataErrorResponseDTO` | Violación de restricciones de base de datos (ej. llave única duplicada). | ```json { "timestamp": "2026-07-31T11:10:00", "status": 409, "error": "Conflict", "message": "Ya existe una transacción con el mismo identificador externo" } ``` |
| `500 INTERNAL ERROR` | `Exception` | `ErrorResponseDTO` | Error interno no controlado del servidor. | ```json { "timestamp": "2026-07-31T11:35:00", "status": 500, "error": "Internal Server Error", "message": "Error interno del servidor. Contactar soporte." } ``` |

***

### 3. Obtener Todas las Transacciones

Devuelve la lista global de todas las transacciones almacenadas en la base de datos (entidades puras).

- **URL:** `/api/v1/analisis/transacciones`
- **Método:** `GET`
- **Códigos de Éxito:** `200 OK`

#### Respuesta Exitosa (`List<Transaccion>` - HTTP 200 OK)

```json
[
  {
    "id": 1,
    "usuarioId": "USR-1001",
    "descripcion": "Supermercado compras de la semana",
    "monto": 42500.00,
    "tipo": "EGRESO",
    "categoria": "Alimentación",
    "fechaTransaccion": "2026-07-31T10:15:30",
    "analisis": null
  },
  {
    "id": 2,
    "usuarioId": "USR-1002",
    "descripcion": "Pago de alquiler",
    "monto": 180000.00,
    "tipo": "EGRESO",
    "categoria": "Vivienda",
    "fechaTransaccion": "2026-07-31T10:20:00",
    "analisis": null
  }
]
```

#### Posibles Errores

| Código HTTP | Excepción | DTO Devuelto | Descripción | Ejemplo |
|-------------|-----------|--------------|-------------|---------|
| `500 INTERNAL ERROR` | `Exception` | `ErrorResponseDTO` | Error interno no controlado del servidor (ej. falla de conexión a BD). | ```json { "timestamp": "2026-07-31T11:35:00", "status": 500, "error": "Internal Server Error", "message": "Error interno del servidor. Contactar soporte." } ``` |

***

### 4. Obtener Transacciones por Usuario

Consulta el historial de transacciones asociadas a un identificador de usuario específico.

- **URL:** `/api/v1/analisis/transacciones/usuario/{usuarioId}`
- **Método:** `GET`
- **Parámetros de Ruta (Path Variable):**
    - `usuarioId` (String, requerido): Ej. `USR-1001`
- **Códigos de Éxito:** `200 OK`, `204 No Content`

#### Respuesta Exitosa (`List<TransaccionResponseDTO>` - HTTP 200 OK)

```json
[
  {
    "id": 1,
    "usuarioId": "USR-1001",
    "monto": 42500.00,
    "tipo": "EGRESO",
    "descripcion": "Supermercado compras de la semana",
    "categoria": "Alimentación",
    "fechaTransaccion": "2026-07-31T10:15:30"
  },
  {
    "id": 2,
    "usuarioId": "USR-1001",
    "monto": 650000.00,
    "tipo": "INGRESO",
    "descripcion": "Cobro de sueldo",
    "categoria": "Salario",
    "fechaTransaccion": "2026-07-31T10:18:00"
  }
]
```

#### Respuesta Exitosa - Sin Contenido (HTTP 204 No Content)

Se devuelve cuando el usuario existe pero no tiene transacciones registradas.

#### Posibles Errores

| Código HTTP | Excepción | DTO Devuelto | Descripción | Ejemplo |
|-------------|-----------|--------------|-------------|---------|
| `404 NOT FOUND` | `ResourceNotFoundException` | `ErrorResponseDTO` | El usuario especificado no existe en el sistema. | ```json { "timestamp": "2026-07-31T11:05:00", "status": 404, "error": "Not Found", "message": "Usuario con ID USR-9999 no encontrado" } ``` |
| `500 INTERNAL ERROR` | `Exception` | `ErrorResponseDTO` | Error interno no controlado del servidor (ej. falla de conexión a BD). | ```json { "timestamp": "2026-07-31T11:35:00", "status": 500, "error": "Internal Server Error", "message": "Error interno del servidor. Contactar soporte." } ``` |

***

## 📄 Resumen de Tabla para Referencia Rápida

| Método | URL | Descripción | Request | Response | Status | Errores Comunes |
|--------|-----|-------------|---------|----------|--------|-----------------|
| POST | `/api/v1/analisis/procesar` | Procesar análisis con IA | `AnalisisInputDTO` | `AnalisisOutputDTO` | 201 Created | 400, 502, 503, 504, 500 |
| POST | `/api/v1/analisis/transacciones` | Crear una transacción | `TransaccionDTO` | `TransaccionResponseDTO` | 201 Created | 400, 409, 500 |
| GET | `/api/v1/analisis/transacciones` | Listar todas las transacciones | Ninguno | `List<Transaccion>` | 200 OK | 500 |
| GET | `/api/v1/analisis/transacciones/usuario/{usuarioId}` | Listar transacciones de un usuario | Path Variable | `List<TransaccionResponseDTO>` | 200 OK / 204 | 404, 500 |

***

## 📦 Colección de JSONs (Ejemplos de Payload)

### 1. Payload de Entrada (`POST` - Request Body)

#### Ejemplo para enviar al endpoint `POST /api/v1/analisis/transacciones`:

```json
{
  "descripcion": "Supermercado compras de la semana",
  "monto": 42500.00,
  "tipo": "EGRESO",
  "categoria": "Alimentación"
}
```

#### Ejemplo sin categoría (para que sea categorizado automáticamente por Python/AI):

```json
{
  "descripcion": "Pago de servicios de internet",
  "monto": 18500.50,
  "tipo": "EGRESO",
  "categoria": ""
}
```

### 2. Respuesta de Salida (`GET` - Response Body)

#### Ejemplo de respuesta devuelta por `GET /api/v1/analisis/transacciones/usuario/USR-1001` (HTTP 200 OK):

```json
[
  {
    "id": 1,
    "usuario_id": "USR-1001",
    "monto": 42500.00,
    "tipo": "EGRESO",
    "descripcion": "Supermercado compras de la semana",
    "categoria": "Alimentación",
    "fecha_transaccion": "2026-07-31T10:15:30"
  },
  {
    "id": 2,
    "usuario_id": "USR-1001",
    "monto": 650000.00,
    "tipo": "INGRESO",
    "descripcion": "Pago de sueldo mensual",
    "categoria": "Salario",
    "fecha_transaccion": "2026-07-31T10:18:00"
  }
]
```

### 3. Ejemplos de Respuestas de Error

#### Error de Validación (400 Bad Request)

```json
{
  "timestamp": "2026-07-31T11:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Errores de validación",
  "details": {
    "monto": "El monto no puede ser negativo",
    "tipo": "El tipo debe ser INGRESO o EGRESO"
  }
}
```

#### Error de Servicio Python (502 Bad Gateway)

```json
{
  "timestamp": "2026-07-31T11:15:00",
  "status": 502,
  "error": "Bad Gateway",
  "message": "El servicio de Python retornó un error",
  "pythonError": {
    "code": "INVALID_INPUT",
    "detail": "El campo 'transacciones' es requerido"
  }
}
```

#### Error de Timeout IA (504 Gateway Timeout)

```json
{
  "timestamp": "2026-07-31T11:25:00",
  "status": 504,
  "error": "Gateway Timeout",
  "message": "El servicio de IA tardó demasiado en responder",
  "isTimeout": true,
  "suggestion": "Reintentar en 60 segundos"
}
```

#### Error de Recurso No Encontrado (404 Not Found)

```json
{
  "timestamp": "2026-07-31T11:05:00",
  "status": 404,
  "error": "Not Found",
  "message": "Usuario con ID USR-9999 no encontrado"
}
```

#### Error Interno del Servidor (500 Internal Server Error)

```json
{
  "timestamp": "2026-07-31T11:35:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error interno del servidor. Contactar soporte."
}
```
#### Error de Conflicto de Datos (409 Conflict)

````json
{
  "timestamp": "2026-07-31T11:10:00",
  "status": 409,
  "error": "Conflict",
  "message": "Ya existe una transacción con el mismo identificador externo"
}
````
#### Error de Servicio No Disponible (503 Service Unavailable)
````json
{
  "timestamp": "2026-07-31T11:20:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "No se pudo conectar con el servicio de análisis",
  "retryAfter": 30
}
````
#### Error del Motor de IA (503 Service Unavailable)

````json
{
  "timestamp": "2026-07-31T11:30:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "El motor de IA no está disponible temporalmente",
  "isTimeout": false,
  "suggestion": "Contactar soporte si persiste"
}
````

___
## 🚀 Registro de Cambios: CORS & Arquitectura Global de Manejo de Errores
Este documento resume las actualizaciones aplicadas en la capa de infraestructura del backend en Spring Boot, centralizando el control de acceso de orígenes cruzados (CORS) y estableciendo una arquitectura robusta para la captura y respuesta unificada de excepciones.

## 🛠️ 1. Configuración Centralizada de CORS (**CorsConfig**)

Se eliminó la anotación **@CrossOrigin(origins = "*")** dispersa en los controladores para evitar inconsistencias y redundancia.

* Ubicación: **saludfinanciera.finanzas.config.CorsConfig**

* Implementación: Define un bean de **WebMvcConfigurer** que intercepta todas las peticiones entrantes (/**).

* Soporte @NonNullApi: Se aplicó **@NonNull** en el parámetro **CorsRegistry** para mantener la conformidad con el contrato de nulidad definido en el paquete.

````java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*");
            }
        };
    }
}
```` 
## 🛡️ 2. Arquitectura Global de Excepciones **(saludfinanciera.finanzas.exception)**
Se creó el paquete **exception** para aislar la lógica de manejo de errores de los controladores, utilizando **@RestControllerAdvice** y DTOs estandarizados.

📁 Estructura del Paquete

````
saludfinanciera/finanzas/exception/
 ├── GlobalExceptionHandler.java          # Interceptor centralizado de excepciones
 ├── ErrorResponseDTO.java               # DTO para errores de Front y validación
 ├── DataErrorResponseDTO.java            # DTO para errores de Persistencia/BD
 ├── PythonServiceErrorDTO.java          # DTO para fallas en microservicio Python
 ├── AIServiceErrorDTO.java              # DTO para timeouts y fallas del LLM/IA
 ├── ResourceNotFoundException.java       # Excepción personalizada (404)
 └── AIServiceUnavailableException.java  # Excepción personalizada para el motor IA
````
## 📊 3. Matriz de Cobertura de Errores

| Capa / Origen | Excepción Interceptada | Código HTTP | DTO Devuelto | Descripción |
|---------------|------------------------|-------------|--------------|-------------|
| Validación DTO (Front) | `MethodArgumentNotValidException` | `400 BAD REQUEST` | `ErrorResponseDTO` | Devuelve un mapa con el detalle de los campos que violaron las reglas (`@NotNull`, `@Valid`, etc.). |
| Recursos Inexistentes | `ResourceNotFoundException` | `404 NOT FOUND` | `ErrorResponseDTO` | Entidades o registros no encontrados en el dominio. |
| Persistencia / BD (data) | `DataIntegrityViolationException` | `409 CONFLICT` | `DataErrorResponseDTO` | Sanitiza el error técnico de SQL y devuelve un mensaje amigable al usuario sobre violaciones de restricción. |
| Microservicio Python | `HttpStatusCodeException` | `502 BAD GATEWAY` | `PythonServiceErrorDTO` | Captura respuestas 4xx/5xx provenientes del cliente externo en Python. |
| Red / Conexión Python | `ResourceAccessException` | `503 SERVICE UNAVAILABLE` | `PythonServiceErrorDTO` | Captura caídas o fallas de red al intentar alcanzar el servicio de Python. |
| Demora / Timeout IA | `TimeoutException`, `SocketTimeoutException` | `504 GATEWAY TIMEOUT` | `AIServiceErrorDTO` | Notifica demoras en la inferencia del modelo (incluye flag `isTimeout: true` para reintentos). |
| Falla del Motor IA | `AIServiceUnavailableException` | `503 SERVICE UNAVAILABLE` | `AIServiceErrorDTO` | Errores internos de ejecución del modelo (Out of Memory, falta de GPU, etc.). |
| General / Inesperado | `Exception` | `500 INTERNAL ERROR` | `ErrorResponseDTO` | Captura no controlada para evitar exponer la traza de Java. |

## 🧪 4. Ejemplos de Respuestas JSON para Frontend
Validation Error **(400 Bad Request)**

````json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación en los datos ingresados",
  "validationErrors": {
    "monto": "El monto debe ser mayor a cero",
    "categoria": "La categoría no puede estar vacía"
  },
  "timestamp": "2026-07-30T10:15:00"
}
````
Data Integrity Conflict **(409 Conflict)**

````json
{
  "status": 409,
  "error": "Conflict de datos",
  "message": "La transacción no pudo ser completada",
  "detail": "Uno de los campos obligatorios de la entidad no fue proporcionado.",
  "timestamp": "2026-07-30T10:40:00"
}
````
AI Timeout **(504 Gateway Timeout)**

````json
{
  "status": 504,
  "error": "AI Service Timeout",
  "message": "El modelo de Inteligencia Artificial tardó demasiado en responder.",
  "aiServiceDetail": "La generación de la respuesta superó el tiempo máximo de espera. Intenta nuevamente con una consulta más corta o en unos momentos.",
  "isTimeout": true,
  "timestamp": "2026-07-30T10:48:12"
}
````
````mermaid
flowchart LR
    subgraph SpringBoot ["SPRING BOOT"]
        A["Parser CSV + Client"]
    end

    subgraph FastAPI ["FASTAPI / NLP"]
        B["Pandas + LLM Profile"]
    end

    A <-->|JSON / DTOs| B

````
___

| Colección     | Nombre en Postman                          | Método | Ruta RESTful sugerida                     | Descripción / Responsable                          |
| ------------- | ------------------------------------------ | ------ | ----------------------------------------- | -------------------------------------------------- |
| Análisis      | [PYTHON IA] POST Analizar Perfil (Interno) | POST   | /api/v1/internal/analisis-perfil          | Microservicio Python (IA / NLP / Random Forest)    |
| Análisis      | POST Generar Análisis Financiero           | POST   | /api/v1/analisis                          | Gateway Spring Boot (orquesta Python y persiste)   |
| Análisis      | GET Obtener Historial de Análisis          | GET    | /api/v1/analisis/usuario/{usuarioId}      | Consulta el historial guardado en la base de datos |
| Análisis      | POST Cargar y Analizar CSV                 | POST   | /api/v1/analisis/csv                      | Ingesta y lectura de archivos CSV                  |
| Transacciones | POST Crear Transacción                     | POST   | /api/v1/transacciones                     | Registro individual de un movimiento               |
| Transacciones | GET Listar Transacciones por Usuario       | GET    | /api/v1/transacciones/usuario/{usuarioId} | Consulta masiva de movimientos por usuario         |
| Transacciones | GET Obtener Transacción por ID             | GET    | /api/v1/transacciones/{id}                | Consulta de un movimiento puntual                  |
| Transacciones | PUT Actualizar Transacción                 | PUT    | /api/v1/transacciones/{id}                | Edición completa o parcial del movimiento          |
| Transacciones | DELETE Eliminar Transacción (Soft Delete)  | DELETE | /api/v1/transacciones/{id}                | Borrado lógico en la base de datos                 |

___
# 📌 Integración con el Microservicio de IA (`/analizar-perfil`)

El microservicio de **Data / Python** expone un **único endpoint** (`POST /analizar-perfil`). Su diseño sigue el *Principio de Responsabilidad Única*: no maneja archivos, no conoce la base de datos ni le importa el origen de la información. Su trabajo es exclusivamente recibir un JSON unificado, procesar los modelos analíticos y retornar los resultados.

---

## 🔄 ¿Cómo interactúa el Backend (Spring Boot) con Data?

El backend de Java actúa como un **orquestador**. Independientemente de la acción que realice el usuario en el frontend, toda interacción con la IA converge en este único punto:

````mermaid
flowchart TD
    A[Cliente HTTP / Postman]
    B[Spring Boot<br/>Procesamiento y API]
    C[Python - IA<br/>NLP y Random Forest]
    D[Base de datos]
    E[Respuesta al cliente]

    A -->|1. Envía datos CSV| B
    B -->|2. Guarda los datos| D
    B -->|3. Envía JSON unificado<br/>POST /analizar-perfil| C
    C -->|4. Devuelve métricas<br/>y recomendaciones| B
    B -->|5. Vincula resultados| D
    B -->|6. Responde al cliente| E
````


---

## 🛠️ Flujos de Entrada en Spring Boot

1. **Análisis Individual (Formulario):**
  * Spring Boot toma el monto y la descripción del formulario.
  * Arma el payload con `historialTransacciones` vacío o con un ítem.
  * Llama a `POST /analizar-perfil`.

2. **Análisis Masivo (Carga de CSV):**
  * Spring Boot recibe el archivo `movimientos.csv` y los parámetros socioeconómicos.
  * Parsea el CSV en memoria y persiste los registros en la base de datos.
  * Convierte cada fila del CSV en la lista `historialTransacciones`.
  * Llama a **mismo endpoint** `POST /analizar-perfil`.

---

## ⚙️ Procesamiento interno en Python

Al recibir la petición, Python ejecuta de forma secuencial:

1. **Categorización NLP:** Asigna categorías (e.g., `ALIMENTACION`, `SERVICIOS`) a cada transacción según su descripción.
2. **Cálculo Financiero:** Determina el total gastado (excluyendo ingresos), capacidad de ahorro mensual, tasa de ahorro y proyección para la meta.
3. **Inferencia ML (Random Forest):** Clasifica el perfil de riesgo (`En riesgo`, `Saludable`, etc.) y calcula la probabilidad del perfil.
4. **Respuesta:** Retorna el diagnóstico estructurado para que Spring Boot lo vincule a las transacciones y lo devuelva al cliente.

___
___
## 🐍 1. Equipo de Data Science / Python
1- Verificar las variables necesarias.
## 🎨 2. Equipo de Frontend (React / Web / Mobile)
El Frontend ya tiene las especificaciones del backend plasmadas en el **README.md** para empezar a consumir la API:

1- **Consumo del Endpoint Principal:**
* Conectarse a **POST http://localhost:8008/api/v1/analisis/procesar** enviando el JSON plano (`ingreso_mensual`, `nivel_endeudamiento`, `frecuencia_ahorro`, `descripcion`, `valor`).

2- **Diseño del Dashboard Financiero:**
* **Pantalla de carga (Loading State):** Implementar spinners/skeletons interactivos mientras Spring Boot procesa la consulta con la IA.
* **Visualización de Resultados:** Renderizar el badge con el **estadoFinanciero** (ej. "Conservador", "Moderado"), el porcentaje o nivel de **probabilidad** y las etiquetas de las **categorias** identificadas.

3- **Validación de Formularios:**
* Asegurar que no se envíen montos negativos o campos vacíos desde la UI antes de gatillar la petición HTTP.

## ☕ 3. Backend (Spring Boot) - A Desarrollar -

1- Capa de Seguridad **Security**

2- Subir a OCI