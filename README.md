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