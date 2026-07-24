## 🚀 Backend & Integración de Capas (Spring Boot + Python NLP)

Este módulo backend actúa como **orquestador principal** del sistema. Se encarga de recibir las peticiones del Frontend, gestionar la persistencia en PostgreSQL y consumir sincrónicamente el microservicio de Data Science (Python) para obtener el análisis con Inteligencia Artificial/NLP.

---

### 🔄 Flujo de Funcionamiento

1. **Recepción & Validación**: El controlador de Spring Boot recibe el JSON del Frontend y valida la estructura de datos (transacciones, montos positivos, campos obligatorios).
2. **Persistencia Inicial**: Se guardan los registros crudos de las transacciones en la base de datos PostgreSQL.
3. **Invocación al Microservicio Data**: Se realiza una petición HTTP POST desde Spring Boot hacia la API de Python (`http://localhost:8008`) enviando el perfil de gastos.
4. **Procesamiento NLP**: El microservicio de Python clasifica/evalúa las métricas e Inteligencia Artificial, determinando el perfil financiero y generando recomendaciones/tips.
5. **Persistencia Consolidada**: Spring Boot recibe la respuesta de Python, guarda el perfil financiero resultante en PostgreSQL y devuelve la respuesta unificada al Frontend.

---

### 🔌 Especificación de Endpoints

#### 1. Frontend ↔ Java Backend (Spring Boot)
* **URL**: `http://localhost:8008/api/v1/analisis/procesar`
* **Método**: `POST`
* **Descripción**: Endpoint principal expuesto al cliente para procesar la salud financiera.
* **Payload de entrada (Request)**:
  
 ```json
  {
    "usuarioId": "USR-12345",
    "transacciones": [
      {
        "descripcion": "Supermercado Carrefour",
        "monto": 45000.00,
        "tipo": "EGRESO",
        "categoria": "ALIMENTACION"
      },
      {
        "descripcion": "Cobro de Sueldo",
        "monto": 500000.00,
        "tipo": "INGRESO",
        "categoria": "INGRESOS"
      }
    ]
  }
  ```

  * Respuesta exitosa (Response 200 OK):
   
  
  ```JSON
{
"estadoFinanciero": "SALUDABLE",
"diagnostico": "Tus ingresos superan holgadamente tus egresos operativos.",
"tips": [
"Considerá destinar un 10% de tu saldo positivo a un fondo de reserva.",
"Mantén controlados los gastos hormiga en compras secundarias."
]
}  
  ```


2. Java Backend ↔ Servicio Data (Python NLP)
* URL: http://localhost:8008/api/v1/analizar-perfil
* Método: **POST**
* Descripción: Microservicio interno consumido mediante **RestClient** por el backend de Java.
* Payload de entrada (Request desde Java):

```json
{
  "usuarioId": "USR-12345",
  "transacciones": [
    {
      "descripcion": "Supermercado Carrefour",
      "monto": 45000.00,
      "tipo": "EGRESO",
      "categoria": "ALIMENTACION"
    }
  ]
}
```
 
* Respuesta del Microservicio (Response a Java):

```json
{
  "estadoFinanciero": "SALUDABLE",
  "diagnostico": "Análisis completado por el modelo NLP.",
  "tips": [
    "Tip sugerido por modelo de evaluación 1",
    "Tip sugerido por modelo de evaluación 2"
  ]
}
```

## 🛠️ Puertos Utilizados
* Java Spring Boot: 8008

* Python Microservice: 8000
 
## 🧪 Pruebas con Python
* Si Python lee la DB directamente: Puede conectarse con **SQLAlchemy** o **psycopg2** apuntando a la misma base    
de datos **salud_financiera** en el puerto **5432** y consultar directamente la tabla **transacciones**.

* Si Python consulta a través de Java: Podés crear un endpoint simple en tu controller de Spring Boot    
(**GET /api/v1/transacciones/usuario/{usuarioId}**) para que Python obtenga los registros mockeados por HTTP.

```Python 
import requests

# Python lee los datos cargados desde Java:
response = requests.get("http://localhost:8008/api/v1/analisis/transacciones/USR-1001")
transacciones = response.json()
``` 

## Imagenes DB


![Dashboard Pg Admin](assets/dashboard-1.png)

![Dashboard Pg Admin](assets/dashboard-2.png)
___
```mermaid

sequenceDiagram
    autonumber
    actor User as Client / Frontend
    participant SB as Spring Boot Backend<br/>(:8008)
    participant DB as PostgreSQL DB<br/>(:5432)
    participant Py as Python NLP Service<br/>(:8000)

%% Estilos de contraste
    rect rgb(240, 244, 248)
        Note over User, Py: Flujo Principal de Procesamiento y Análisis
    end

    User->>SB: POST /api/v1/analisis/procesar<br/>(Payload con Usuario y Transacciones)

    activate SB
    Note over SB: 1. Valida payload<br/>2. Aplica @PrePersist (TIMESTAMP(0))

    SB->>DB: INSERT transacciones / analisis
    activate DB
    DB-->>SB: Confirmación de Persistencia
    deactivate DB

    SB->>Py: POST /api/v1/analizar-perfil<br/>(Vía RestClient de Spring)
    activate Py

    Note over Py: Procesamiento NLP,<br/>evaluación de perfil y tips

    Py-->>SB: Responde Diagnóstico y Tips
    deactivate Py

    SB->>DB: UPDATE / SAVE Resultados consolidados
    activate DB
    DB-->>SB: OK
    deactivate DB

    SB-->>User: 200 OK (Estado financiero, Diagnóstico y Tips)
    deactivate SB
```
___

```mermaid
   graph TD
    Client[Client / Frontend] -->|HTTP POST :8008| Controller[Spring Boot REST Controller]
    
    subgraph Spring Boot Backend
        Controller --> Service[Análisis Service]
        Service --> Repository[Spring Data JPA / Hibernate]
        Service --> RestClient[RestClient HTTP Config]
    end

    Repository -->|Persiste con TIMESTAMP 0| Postgres[(PostgreSQL DB :5432)]
    RestClient -->|HTTP POST :8000| FastApi[Python FastAPI / NLP Service]
```

## 🐍 1. Equipo de Data Science / Python
Una vez que el endpoint mock de Python responde correctamente a Spring Boot, el objetivo de Data es darle valor a los modelos de análisis:

1- Implementar la lógica real de NLP/Machine Learning:

* Reemplazar la respuesta mock del endpoint **/api/v1/analizar-perfil** por el modelo real (clasificación de gastos, detección de patrones de consumo o generación de diagnósticos con IA).

2- Definir el manejo de errores/fallbacks:

* Configurar respuestas de contingencia (ej. si una categoría no es reconocida o si el volumen de datos es insuficiente para el modelo) para que devuelva una estructura JSON válida sin romper el flujo.

3- Optimizar tiempos de respuesta:

* Asegurar que la inferencia del modelo responda de manera ágil (idealmente < 1.5s) ya que Spring Boot realiza una llamada síncrona mientras el usuario espera en la app.

## 🎨 2. Equipo de Frontend (React / Web / Mobile)
El Frontend ya tiene las especificaciones del backend plasmadas en el **README.md** para empezar a consumir la API:

1- Consumo del Endpoint Principal:

* Conectarse a **POST http://localhost:8008/api/v1/analisis/procesar** enviando el payload con **usuarioId** y la lista de **transacciones**.

2- Diseño del Dashboard Financiero:

* Pantalla de carga (Loading State): Implementar spinners/skeletons interactivos mientras Spring Orchestrator procesa la persistencia y consulta a Python.

* Visualización de Resultados: Renderizar el badge con el **estadoFinanciero** (ej. SALUDABLE en verde, CRÍTICO en rojo), la caja de **diagnostico** y la lista de **tips** sugeridos.

3- Validación de Formularios:

* Asegurar que no se envíen montos negativos o campos vacíos desde la UI antes de gatillar la petición HTTP.

## ☕ 3. Backend (Spring Boot) - Tareas de Apoyo y Resiliencia
Desde el lado Java, para dejar el sistema "a prueba de balas":

1- Manejo de Errores e Integración (Resilience):

* Implementar un **@RestControllerAdvice** para capturar la **ResourceAccessException** si el microservicio de Python llegara a caerse y responder un **503 Service Unavailable** limpio o un diagnóstico por defecto al Frontend.

2- CORS (Cross-Origin Resource Sharing):

* Habilitar **@CrossOrigin(origins = "*")** (o la URL del Frontend) en el controlador para que React/Angular pueda hacer peticiones sin ser bloqueado por el navegador.