## 🔌 Contrato de API (Endpoints)

### 1. Procesar Análisis Financiero (NLP / IA)

* **URL:** `/api/v1/analisis/procesar`
* **Método:** `POST`
* **Descripción:** Recibe los datos financieros básicos de un movimiento/usuario y devuelve el perfil predicho por el microservicio de Inteligencia Artificial (Python NLP).

#### 📥 Body de la Petición (`Request JSON`)

```json
{
  "ingreso_mensual": 650000.00,
  "nivel_endeudamiento": 2,
  "frecuencia_ahorro": "MENSUAL",
  "descripcion": "Supermercado Coto compras semana",
  "valor": 42500.00
}
```
## 📤 Respuesta Exitosa (Response JSON - 200 OK)

```json
{
  "categoria": [
    "ALIMENTACION"
  ],
  "perfil_financiero": "Moderado",
  "probabilidad": 0.85
}
```
2. Historial de Transacciones (Opcional / Backend Internal)

* **GET /api/v1/analisis/transacciones**: Obtiene el listado general de transacciones registradas.

* **GET /api/v1/analisis/transacciones/{usuarioId}**: Obtiene las transacciones filtradas por el identificador del usuario.

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
## 🐍 1. Equipo de Data Science / Python
Una vez que el endpoint mock de Python responde correctamente a Spring Boot, el objetivo de Data es darle valor a los modelos de análisis:

1- **Implementar la lógica real de NLP/Machine Learning:**
* Reemplazar la respuesta mock del microservicio por el modelo real (categorización de descripciones de consumo, cálculo del perfil financiero y score de probabilidad).

2- **Definir el manejo de errores/fallbacks:**
* Configurar respuestas de contingencia en Python (ej. si una categoría o término no es reconocido por la IA) para que siempre devuelva una estructura JSON válida sin romper el flujo.

3- **Optimizar tiempos de respuesta:**
* Asegurar que la inferencia del modelo responda de manera ágil (idealmente < 1.5s) ya que Spring Boot realiza una llamada síncrona mientras el usuario espera en la app.

## 🎨 2. Equipo de Frontend (React / Web / Mobile)
El Frontend ya tiene las especificaciones del backend plasmadas en el **README.md** para empezar a consumir la API:

1- **Consumo del Endpoint Principal:**
* Conectarse a **POST http://localhost:8008/api/v1/analisis/procesar** enviando el JSON plano (`ingreso_mensual`, `nivel_endeudamiento`, `frecuencia_ahorro`, `descripcion`, `valor`).

2- **Diseño del Dashboard Financiero:**
* **Pantalla de carga (Loading State):** Implementar spinners/skeletons interactivos mientras Spring Boot procesa la consulta con la IA.
* **Visualización de Resultados:** Renderizar el badge con el **estadoFinanciero** (ej. "Conservador", "Moderado"), el porcentaje o nivel de **probabilidad** y las etiquetas de las **categorias** identificadas.

3- **Validación de Formularios:**
* Asegurar que no se envíen montos negativos o campos vacíos desde la UI antes de gatillar la petición HTTP.

## ☕ 3. Backend (Spring Boot) - Tareas de Apoyo y Resiliencia
Desde el lado Java, para dejar el sistema "a prueba de balas":

1- Manejo de Errores e Integración (Resilience):

* Implementar un **@RestControllerAdvice** para capturar la **ResourceAccessException** si el microservicio de Python llegara a caerse y responder un **503 Service Unavailable** limpio o un diagnóstico por defecto al Frontend.

2- CORS (Cross-Origin Resource Sharing):

* Habilitar **@CrossOrigin(origins = "*")** (o la URL del Frontend) en el controlador para que React/Angular pueda hacer peticiones sin ser bloqueado por el navegador.