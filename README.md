🧠 Sistema Integral de Análisis y Recomendaciones Financieras
Hackathon ONE – G9 | Alura + Oracle
Sistema end-to-end de análisis financiero que integra Frontend Web, Backend Java/Spring Boot, Machine Learning en Python, NLP, ciencia de datos y un motor de recomendaciones basado en reglas de negocio.
________________________________________
🎯 Visión general
El proyecto transforma información financiera del usuario —transacciones, ingresos, deudas, ahorro, inversiones, fondo de emergencia y suscripciones— en un diagnóstico financiero estructurado.
El sistema combina tres grandes capas:
Capa	Tecnología	Responsabilidad
🎨 Frontend	HTML, CSS, JavaScript	Interfaz de usuario, formularios, resultados e historial
⚙️ Backend	Java 21 + Spring Boot 3.4.2	API REST, autenticación, persistencia, orquestación e integración
🧠 Python / IA	Python 3.11+ + FastAPI + scikit-learn	NLP, clasificación, perfil financiero y recomendaciones
________________________________________
🏗️ Arquitectura End-to-End
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND WEB                             │
│                     HTML + CSS + JavaScript                      │
│                                                                  │
│ Registro · Login · Análisis · Clasificación · Historial          │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND JAVA                                │
│                 Spring Boot 3.4.2                                │
│                                                                  │
│ Controllers · Services · Security · Repositories · DTOs          │
└───────────────┬──────────────────────────────┬───────────────────┘
                │                              │
                │ PostgreSQL / H2              │ REST
                ▼                              ▼
┌─────────────────────────┐       ┌────────────────────────────────┐
│      BASE DE DATOS      │       │       MICROSERVICIO PYTHON     │
│                         │       │          FastAPI + ML           │
│ Usuarios                │       │                                │
│ Análisis                │       │  ┌──────────────────────────┐  │
│ Transacciones           │       │  │ Clasificador NLP         │  │
└─────────────────────────┘       │  │ TF-IDF + LogisticReg.    │  │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ Ingeniería características│ │
                                  │  │ + Perfil financiero       │ │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ Profile Flexibility      │  │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ Recommendation Engine    │  │
                                  │  │ 7 reglas de negocio      │  │
                                  │  └──────────────────────────┘  │
                                  └────────────────────────────────┘
________________________________________
📂 Estructura general del proyecto
proyecto/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── analisis.html
│   ├── historial.html
│   ├── css/
│   └── js/
│
├── backend/
│   └── src/main/java/saludfinanciera/finanzas/
│       ├── client/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── exception/
│       ├── model/
│       ├── repository/
│       └── service/
│
└── python/
    ├── clasificador/
    ├── ciencia_datos/
    ├── recomendaciones/
    ├── api/
    ├── modelos/
    ├── datos/
    ├── resultados/
    ├── contratos/
    ├── ejemplos/
    ├── tests/
    ├── entrenar.py
    └── probar_modelo_json.py
________________________________________
🎨 1. FRONTEND
📌 Descripción
El frontend proporciona la interfaz gráfica para que el usuario pueda:
•	Registrarse.
•	Iniciar sesión.
•	Consultar y gestionar su cuenta.
•	Ingresar información financiera.
•	Registrar transacciones.
•	Ejecutar un análisis financiero.
•	Clasificar transacciones individualmente.
•	Consultar recomendaciones.
•	Consultar el historial de análisis.
Está desarrollado utilizando tecnologías web estándar:
HTML5
CSS3
JavaScript
Fetch API
REST / JSON
________________________________________
📂 Organización
frontend/
│
├── index.html
├── login.html
├── registro.html
├── analisis.html
├── historial.html
│
├── css/
│   ├── styles.css
│   └── ...
│
└── js/
    ├── auth.js
    ├── analisis.js
    ├── historial.js
    └── ...
________________________________________
🔄 Comunicación con el Backend
El frontend utiliza peticiones HTTP asíncronas mediante fetch.
Autenticación
POST /api/v1/auth/registro
POST /api/v1/auth/login
DELETE /api/v1/auth/eliminar
Análisis financiero
POST /api/v1/finanzas/analizar
POST /api/v1/finanzas/clasificar
GET  /api/v1/finanzas/historial/{usuarioId}
GET  /api/v1/finanzas/historial
El flujo general es:
Usuario
   │
   ▼
Formulario HTML
   │
   ▼
JavaScript
   │
   │ fetch()
   ▼
Spring Boot
   │
   ▼
Respuesta JSON
   │
   ▼
JavaScript
   │
   ▼
Renderización de resultados
________________________________________
🔐 Autenticación
Registro
El usuario proporciona:
{
  "nombre": "Usuario",
  "email": "usuario@email.com",
  "password": "********"
}
El frontend envía la información al backend:
POST /api/v1/auth/registro
Login
POST /api/v1/auth/login
La respuesta contiene información estructurada de autenticación:
{
  "token": "...",
  "status": "...",
  "id": 1,
  "email": "usuario@email.com"
}
________________________________________
⚙️ 2. BACKEND — JAVA + SPRING BOOT
📌 Descripción
El backend funciona como núcleo de la plataforma.
Sus responsabilidades son:
•	Exponer la API REST.
•	Gestionar usuarios.
•	Autenticar credenciales.
•	Persistir información financiera.
•	Gestionar análisis históricos.
•	Validar datos recibidos.
•	Comunicarse con el microservicio Python.
•	Gestionar errores.
•	Aplicar mecanismos de resiliencia.
________________________________________
🛠️ Stack tecnológico
Java 21
Spring Boot 3.4.2
Spring Web
Spring Data JPA
Spring Security
PostgreSQL
H2
RestClient
Jakarta Bean Validation
BCrypt
________________________________________
📂 Arquitectura por capas
src/main/java/saludfinanciera/finanzas/
│
├── client/
│   └── Clientes HTTP para Python
│
├── config/
│   └── Seguridad, CORS y configuración global
│
├── controller/
│   └── Endpoints REST
│
├── dto/
│   └── Request / Response / Errors
│
├── exception/
│   └── Excepciones y manejo global
│
├── model/
│   └── Entidades JPA
│
├── repository/
│   └── Acceso a datos
│
└── service/
    └── Lógica de negocio
________________________________________
📡 API REST del Backend
🔐 Autenticación
Registrar usuario
POST /api/v1/auth/registro
Registra un usuario y almacena su contraseña utilizando BCrypt.
Iniciar sesión
POST /api/v1/auth/login
Valida las credenciales y devuelve la información necesaria para la sesión.
Eliminar cuenta
DELETE /api/v1/auth/eliminar
Permite eliminar una cuenta de usuario.
________________________________________
💰 Análisis financiero
Analizar perfil
POST /api/v1/finanzas/analizar
Envía los datos financieros y las transacciones al microservicio Python.
Clasificar transacción
POST /api/v1/finanzas/clasificar
Permite clasificar una transacción individual mediante modelos entrenados.
Historial por usuario
GET /api/v1/finanzas/historial/{usuarioId}
Devuelve los análisis financieros ordenados desde el más reciente.
Historial general
GET /api/v1/finanzas/historial
Obtiene automáticamente el historial del primer usuario activo del sistema.
________________________________________
🔐 Configuración segura
Las credenciales de la base de datos no deben almacenarse directamente en el código.
Variables utilizadas:
DB_USERNAME
DB_PASSWORD
PORT_USER
Ejemplo:
spring.datasource.url=jdbc:postgresql://localhost:5432/salud_financiera
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
Puerto predeterminado:
8080
________________________________________
🤖 Integración Backend ↔ Python
El backend Java consume el microservicio Python mediante RestClient.
Java / Spring Boot
        │
        │ HTTP + JSON
        ▼
Python / FastAPI
        │
        ▼
Machine Learning
        │
        ▼
JSON
        │
        ▼
Spring Boot
        │
        ▼
Frontend
Endpoint de análisis general
POST /api/v1/analizar-perfil
Recibe:
Ingresos
Deudas
Ahorro
Inversiones
Fondo de emergencia
Suscripciones
Transacciones
Devuelve:
Probabilidades
Perfil financiero
Resumen de gastos
Recomendaciones
Endpoint de clasificación
POST /api/v1/clasificar-transaccion
Recibe una transacción y devuelve su categoría y confiabilidad.
________________________________________
🛡️ Fallback
El backend implementa un mecanismo de respaldo para evitar que la caída del microservicio Python provoque una caída completa de la aplicación.
                  ┌── Python responde ──► Resultado Modelo
                  │
Backend ──────────┤
                  │
                  └── Python falla ─────► Resultado fallback
Esto permite mantener una respuesta funcional incluso ante problemas temporales de red o disponibilidad del servicio de IA.
________________________________________
🧠 3. PYTHON — MACHINE LEARNING + FASTAPI
📌 Responsabilidades
El módulo Python concentra la inteligencia del sistema:
1.	Clasificación NLP de transacciones.
2.	Ingeniería de características financieras.
3.	Clasificación del tipo de ingreso.
4.	Predicción del perfil financiero.
5.	Flexibilización del perfil.
6.	Motor de recomendaciones.
7.	Exposición mediante FastAPI.
________________________________________
🧠 3.1 Clasificador NLP
El clasificador recibe la descripción de una transacción y determina una de las 12 categorías financieras.
Es un problema de clasificación supervisada multiclase.
________________________________________
Arquitectura
Descripción
     │
     ▼
Normalización
     │
     ├───────────────┐
     ▼               ▼
TF-IDF palabras   TF-IDF caracteres
1–2 gramos        3–5 gramos
     │               │
     └───────┬───────┘
             ▼
      Señales léxicas
             │
             ▼
   FeatureUnion
             │
             ▼
 LogisticRegression
             │
             ▼
 Temperature Scaling
             │
             ▼
 Política de confianza
             │
             ▼
Categoría + confiabilidad
Configuración
TF-IDF palabras:      1–2 gramos
Peso:                 1.0

TF-IDF caracteres:    3–5 gramos
Peso:                 0.8

Señales léxicas:
Peso:                 2.5

LogisticRegression:
C = 3.0
class_weight = balanced
________________________________________
📊 Categorías financieras
ALIMENTACION
APORTE_INVERSIONES
EDUCACION
GASTOS_HORMIGA
INGRESOS
OCIO
OTROS
SALUD
SERVICIOS
SUSCRIPCIONES
TRANSPORTE
VIVIENDA
Ejemplos:
Categoría	Ejemplos
Alimentación	supermercado, restaurante, abarrotes
Aporte inversiones	acciones, ETF, AFP, broker, cripto
Educación	universidad, curso, matrícula
Gastos hormiga	café, snack, golosina
Ingresos	sueldo, salario, honorarios
Ocio	cine, concierto, videojuego
Otros	retiro, ropa, impuesto
Salud	farmacia, clínica, dentista
Servicios	electricidad, internet, agua
Suscripciones	Netflix, Spotify, streaming
Transporte	Uber, taxi, gasolina, peaje
Vivienda	alquiler, hipoteca, condominio
________________________________________
🎯 Política de confianza
El clasificador utiliza varios criterios antes de aceptar automáticamente una predicción:
Umbral mínimo:          55%
Margen mínimo:           8%
Cobertura léxica mínima: 20%
Si alguna condición crítica no se cumple:
→ respaldo: OTROS
El modelo conserva información adicional para auditoría, como margen, cobertura léxica, top-3 y motivo de rechazo.
________________________________________
📈 Evaluación del modelo NLP
Se compararon cinco familias utilizando StratifiedGroupKFold:
Modelo	F1 macro agrupado	Exactitud agrupada
SVM lineal	75.03%	74.74%
Regresión logística	74.87%	73.37%
SGD logístico	74.47%	73.58%
Naive Bayes complementario	73.22%	74.01%
Bosque aleatorio	68.29%	67.86%
Se seleccionó Regresión Logística porque:
•	La diferencia frente a SVM fue de solo 0.16 puntos de F1.
•	Proporciona probabilidades nativas.
•	Permite calibrar la confiabilidad.
•	Produce un artefacto compacto.
•	Simplifica la inferencia y el despliegue.
________________________________________
📚 Datos de entrenamiento
El entrenamiento final utiliza:
100,000 descripciones únicas
118 textos manuales curados
99,882 variaciones sintéticas reproducibles
94 casos de calibración
72 casos de holdout final
La generación de datos es determinista y reproducible.
Las variaciones sintéticas conservan el grupo conceptual original para evitar fuga semántica.
Las 100,000 muestras no representan 100,000 transacciones reales independientes. Para producción se recomienda incorporar datos reales anonimizados.
________________________________________
📊 Resultados del holdout
Métrica	Resultado
Exactitud	95.83%
F1 macro	95.82%
Log-loss	0.1848
Brier multiclase	0.0533
ECE	2.62%
Cobertura automática	98.61%
Precisión entre aceptadas	97.18%
El holdout es pequeño y debe considerarse evidencia inicial, no una garantía de rendimiento en producción.
La validación agrupada es especialmente importante para evaluar generalización hacia conceptos nuevos.
________________________________________
📦 Contrato JSON del clasificador
Entrada individual
{
  "descripcion": "Netflix",
  "valor": 15.0,
  "fecha": "2026-08-07"
}
Salida individual
{
  "categoria": "SUSCRIPCIONES",
  "confiabilidad": 0.999
}
En lotes:
{
  "transacciones": [
    {
      "descripcion": "Netflix",
      "valor": 15,
      "fecha": "2026-08-07"
    },
    {
      "descripcion": "aporte a fondo mutuo",
      "valor": 200,
      "fecha": "2026-08-07"
    }
  ]
}
Respuesta:
{
  "transacciones": [
    {
      "categoria": "SUSCRIPCIONES",
      "confiabilidad": 0.999
    },
    {
      "categoria": "APORTE_INVERSIONES",
      "confiabilidad": 0.9674
    }
  ]
}
Contrato de variables
Campo	Tipo	Uso
descripcion	Texto no vacío	Variable predictora
valor	Número finito	Validación; no entra al modelo
fecha	ISO-8601	Validación; no entra al modelo
El modelo aprende exclusivamente de descripcion.
________________________________________
📊 3.2 Ciencia de Datos Perfil Financiero
El módulo transforma los datos financieros en variables que permiten determinar el estado financiero del usuario.
________________________________________
Flujo
Información financiera
        │
        ▼
Transacciones
        │
        ▼
Clasificación de ingresos
        │
        ▼
Ingeniería de características
        │
        ▼
Variables financieras
        │
        ▼
Modelo Machine Learning
        │
        ├───────────────┐
        ▼               ▼
Perfil financiero   Probabilidades
________________________________________
📐 17 variables financieras
ingreso_mensual
gasto_mensual_total
tasa_ahorro
objetivo_presupuesto
relacion_deuda_ingreso
pago_prestamo
monto_inversion
servicios_suscripcion
fondo_emergencia
cantidad_transacciones
gastos_discrecionales
gastos_esenciales
tipo_ingreso
alquiler_o_hipoteca
estado_flujo_caja
nivel_estres_financiero
ahorro_real
________________________________________
🧮 Fórmulas principales
ahorro_real =
    ingreso_mensual
    - gasto_mensual_total
    + aporte_inversiones

tasa_ahorro =
    ahorro_real / ingreso_mensual

relacion_deuda_ingreso =
    deuda_total / ingreso_mensual

meses_reserva =
    fondo_emergencia / gasto_mensual_esencial
________________________________________
Tipo de ingreso
Salario
Independiente
Mixto
Sin ingreso
Estrés financiero
Bajo
Medio
Alto
Perfil financiero
El modelo puede clasificar al usuario como:
Excelente
Saludable
Estable
En observación
En riesgo
Crítico
Además de la etiqueta se devuelven probabilidades por clase.
________________________________________
💡 3.3 Recommendation Engine
El motor de recomendaciones no utiliza Machine Learning.
Su inteligencia está implementada mediante 7 reglas de negocio programadas en Python.
Datos financieros
       │
       ▼
Adaptador financiero
       │
       ▼
Perfil flexibilizado
       │
       ▼
Recommendation Engine
       │
       ▼
7 reglas de negocio
       │
       ▼
Recomendaciones priorizadas
________________________________________
7 reglas
#	Regla	Prioridad	Impacto
1	Ahorro	2–3	Medio/Bajo
2	Endeudamiento	1–3	Alto/Bajo
3	Fondo de emergencia	1–4	Alto/Bajo
4	Flujo de caja	1–2	Alto/Medio
5	Suscripciones	3	Bajo
6	Perfil financiero	0–4	Alto/Bajo
7	Confianza del modelo	4	Informativo
Cada recomendación contiene:
Categoría
Prioridad
Título
Explicación
Acción
Impacto
Score
Fecha de generación
El score se encuentra entre:
0.0 – 1.0
________________________________________
🔄 Adaptador financiero
financial_data_adapter.py adapta las variables generadas por el modelo de ciencia de datos a los nombres y formatos requeridos por las reglas.
Calcula, entre otras:
meses_reserva
ratio_suscripciones
Esto permite mantener desacoplados los modelos de Machine Learning y el motor de reglas.
________________________________________
🎚️ Flexibilización del perfil
profile_flexibility.py ajusta la etiqueta generada por Machine Learning cuando existen indicadores financieros especialmente relevantes.
Ejemplos:
Si probabilidad < 0.55
y deuda > 50%
→ Crítico
Si tasa_ahorro ≥ 25%
y reserva ≥ 6 meses
→ Excelente
________________________________________
📡 3.4 API FastAPI
Endpoint principal
POST /analizar-perfil
Content-Type: application/json
La API Python funciona como punto de integración entre:
Clasificador NLP
        +
Ciencia de Datos
        +
Perfil financiero
        +
Recommendation Engine
________________________________________
Request
{
  "ingreso_mensual": 5000.0,
  "nivel_endeudamiento": 0.35,
  "frecuencia_ahorro": "mensual",
  "monto_inversion": 500.0,
  "deuda_total": 1750.0,
  "objetivo_presupuesto": 3000.0,
  "pago_mensual_deuda": 350.0,
  "servicios_suscripción": 3,
  "fondo_emergencia": 4500.0,
  "transacciones": [
    {
      "descripcion": "PAGO SUPERMERCADO METRO",
      "valor": -150.50
    },
    {
      "descripcion": "UBER VIAJE CENTRO",
      "valor": -25.00
    },
    {
      "descripcion": "NETFLIX MENSUAL",
      "valor": -15.99
    }
  ]
}
________________________________________
Response
{
  "probabilidad_categoria": 0.87,
  "probabilidad_perfil_financiero": 0.76,
  "probabilidad_recomendaciones": 0.82,
  "perfil_financiero": "Estable",
  "resumen_gastos": {
    "Alimentación": 150.50,
    "Transporte": 25.00,
    "Suscripciones": 15.99
  },
  "recomendaciones": [
    "Fondo de emergencia en etapa inicial: Tienes un pequeño avance...",
    "Optimización de membresías y servicios digitales...",
    "Impulsa tu estabilidad al siguiente nivel..."
  ]
}
________________________________________
🔄 Flujo completo del análisis
1. Usuario introduce datos
          │
          ▼
2. Frontend
          │
          ▼
3. Backend Java
          │
          ▼
4. API Python
          │
          ▼
5. Clasificación NLP
          │
          ▼
6. Ingeniería de 17 características
          │
          ▼
7. Predicción del perfil financiero
          │
          ▼
8. Flexibilización del perfil
          │
          ▼
9. Recommendation Engine
          │
          ▼
10. Respuesta JSON
          │
          ▼
11. Backend persiste el análisis
          │
          ▼
12. Frontend muestra resultados
________________________________________
📦 Artefactos de Machine Learning
Los artefactos .pkl pertenecen exclusivamente a los módulos de Machine Learning.
modelos/
│
├── clasificador_gastos.pkl
├── clasificador_gastos.pkl.sha256
├── modelo_perfil_financiero.pkl
├── modelo_tipo_ingreso_1.pkl
└── modelo_tipo_ingreso_2.pkl
Archivo	Contenido	
clasificador_gastos.pkl	TF-IDF + LogisticRegression + calibración	
clasificador_gastos.pkl.sha256	Checksum de integridad	
modelo_perfil_financiero.pkl	Clasificador del perfil	
modelo_tipo_ingreso_1.pkl	Tipo de ingreso v1	
modelo_tipo_ingreso_2.pkl	Tipo de ingreso v2	
El Recommendation Engine no necesita .pkl, ya que está construido con reglas de negocio en Python puro.
________________________________________
🛡️ Seguridad y robustez
Clasificador NLP
•	Validación anti-fuga entre splits.
•	Detección de descripciones contradictorias.
•	Prevención de duplicados.
•	Checksum SHA-256.
•	Comparación mediante hmac.compare_digest.
•	Validación de versión del artefacto.
•	Detección de incompatibilidad de scikit-learn.
•	Serialización atómica.
•	fsync.
•	Política de confianza multicriterio.
Ciencia de Datos
•	Aumento sintético determinista.
•	Reproducibilidad.
•	Grupos trazables.
•	Validación cruzada sin fuga semántica.
•	Validación estricta de columnas.
•	Validación de categorías.
Recommendation Engine
•	Adaptador de variables.
•	Alias de compatibilidad.
•	Cálculo defensivo de variables derivadas.
•	Ordenamiento determinista.
•	Flexibilización dinámica del perfil.
Backend
•	BCrypt para credenciales.
•	Bean Validation.
•	Manejo global de excepciones.
•	Variables de entorno para secretos.
•	CORS configurado.
•	Fallback ante indisponibilidad del servicio Python.
________________________________________
🚀 Uso del módulo Python
Cargar el clasificador
from clasificador.modelo import cargar_modelo

modelo = cargar_modelo(
    "modelos/clasificador_gastos.pkl",
    verificar_integridad=True
)

resultado = modelo.predecir("PAGO SUPERMERCADO METRO")

print(resultado["categoria"])
print(resultado["confianza_porcentaje"])
________________________________________
Clasificar un JSON
from clasificador.contrato_json import clasificar_payload

payload = {
    "transacciones": [
        {
            "descripcion": "UBER VIAJE",
            "valor": -25.0,
            "fecha": "2026-08-19T09:00:00Z"
        },
        {
            "descripcion": "NETFLIX MENSUAL",
            "valor": -15.99,
            "fecha": "2026-08-19T00:00:00Z"
        }
    ]
}

resultado = clasificar_payload(payload, modelo)
________________________________________
Entrenar el clasificador
from clasificador.modelo import ClasificadorGastos
from clasificador.datos import cargar_datos_entrenamiento_ampliado

datos = cargar_datos_entrenamiento_ampliado(
    "transacciones.csv",
    objetivo_total=100_000
)

clasificador = ClasificadorGastos(
    umbral_confianza=0.55,
    margen_minimo=0.08,
    cobertura_minima=0.20,
    c_regularizacion=3.0
)

clasificador.entrenar(
    datos["descripcion"],
    datos["categoria"]
)

clasificador.guardar(
    "modelos/clasificador_gastos.pkl"
)
________________________________________
Ejecutar Recommendation Engine
from recomendaciones import RecommendationEngine

engine = RecommendationEngine()

financial_data = {
    "ingreso_mensual": 5000,
    "gasto_mensual_total": 3500,
    "tasa_ahorro": 0.15,
    "relacion_deuda_ingreso": 0.35,
    "meses_reserva": 1.3,
    "fondo_emergencia": 4500,
    "servicios_suscripcion": 45,
    "ahorro_real": 750,
    "deuda_total": 1750
}

recomendaciones = engine.generate(
    "Estable",
    financial_data,
    probability=0.76
)

for r in recomendaciones:
    print(f"[{r.prioridad}] {r.titulo}: {r.accion}")
________________________________________
🧪 Reproducción del modelo NLP
Los dos ejecutables principales son:
entrenar.py
probar_modelo_json.py
Probar el modelo
1.	Editar:
ejemplos/entrada_transacciones.json
2.	Ejecutar:
probar_modelo_json.py
3.	Revisar:
ejemplos/salida_transacciones.json
Instalar entorno Python
py -3.13 -m venv .venv_hackathon

.\.venv_hackathon\Scripts\python.exe -m pip install -r requirements.txt
Ejecutar pruebas
.\.venv_hackathon\Scripts\python.exe -m pytest -q
Ejecutar FastAPI
uvicorn api.api_router:router --host 0.0.0.0 --port 8000
________________________________________
📁 Estructura detallada del módulo Python
python/
│
├── clasificador/
│   ├── __init__.py
│   ├── modelo.py
│   ├── datos.py
│   ├── texto.py
│   └── contrato_json.py
│
├── ciencia_datos/
│   ├── generar_caracteristicas.py
│   ├── clasificar_tipo_ingreso.py
│   └── notebooks/
│
├── recomendaciones/
│   ├── __init__.py
│   ├── recommendation_engine.py
│   ├── recommendation_rules.py
│   ├── recommendation_models.py
│   ├── recommendation_serializer.py
│   ├── recommendation_service.py
│   ├── financial_data_adapter.py
│   ├── profile_flexibility.py
│   ├── financial_processor.py
│   └── json_loader.py
│
├── api/
│   ├── api_router.py
│   └── schemas.py
│
├── modelos/
│   ├── clasificador_gastos.pkl
│   ├── clasificador_gastos.pkl.sha256
│   ├── modelo_perfil_financiero.pkl
│   ├── modelo_tipo_ingreso_1.pkl
│   └── modelo_tipo_ingreso_2.pkl
│
├── datos/
├── resultados/
├── contratos/
├── ejemplos/
├── tests/
│
├── entrenar.py
├── probar_modelo_json.py
└── requirements.txt
________________________________________
🧰 Tecnologías
Frontend
HTML5
CSS3
JavaScript
Fetch API
REST / JSON
Backend
Java 21
Spring Boot 3.4.2
Spring Web
Spring Data JPA
Spring Security
PostgreSQL
H2
RestClient
Jakarta Validation
BCrypt
Python / IA
Python 3.11+
FastAPI
Pydantic
scikit-learn 1.3+
NumPy
SciPy
Pandas
Joblib
Jupyter Notebook
Unicodedata
________________________________________
🧩 Responsabilidades por componente
Componente	Responsable	Tecnología
Frontend	Frontend	HTML/CSS/JS
API principal	Backend	Java/Spring Boot
Persistencia	Backend	JPA/PostgreSQL
Seguridad	Backend	Spring Security + BCrypt
Clasificador NLP	Data Scientist	Python + scikit-learn
Ingeniería de características	Data Scientist	Python + Pandas
Perfil financiero	Data Scientist	Machine Learning
Tipo de ingreso	Data Scientist	Machine Learning
Flexibilización	Data Scientist	Python
Recommendation Engine	Data Scientist	Python
API IA	Data Scientist	FastAPI
Integración Java ↔ Python	Backend	RestClient
________________________________________
🔒 Consideraciones de seguridad
⚠️ Los archivos Pickle deben cargarse únicamente desde fuentes confiables. La deserialización de Pickle puede ejecutar código arbitrario.
El clasificador implementa un checksum SHA-256 para detectar modificaciones del artefacto antes de cargarlo.
Sin embargo, la integridad criptográfica no convierte en confiable una fuente desconocida: solo deben utilizarse artefactos provenientes de una fuente confiable.
Las credenciales de base de datos deben mantenerse mediante variables de entorno y nunca incluirse en el repositorio.
________________________________________
📈 Limitaciones y mejoras futuras
El proyecto constituye un MVP funcional, por lo que existen oportunidades para mejorar su comportamiento en producción:
•	Incorporar transacciones reales anonimizadas.
•	Incrementar el tamaño del holdout.
•	Evaluar datos reales de diferentes bancos y países.
•	Incorporar correcciones proporcionadas por usuarios.
•	Vigilar deriva de comercios y nuevas suscripciones.
•	Incorporar nuevos regionalismos y abreviaturas.
•	Recalibrar periódicamente las probabilidades.
•	Analizar especialmente confusiones entre:
o	Alimentación / Vivienda.
o	Ocio / Otros.
•	Mejorar la autenticación y autorización para un entorno productivo.
•	Restringir CORS a dominios conocidos en producción.
•	Implementar observabilidad y métricas de disponibilidad del microservicio Python.
________________________________________
🏆 Aporte del proyecto
Transformamos datos financieros dispersos en un diagnóstico financiero estructurado y en recomendaciones personalizadas, priorizadas y accionables.
                  DATOS FINANCIEROS
                         │
                         ▼
                ┌─────────────────┐
                │    FRONTEND     │
                │ HTML/CSS/JS     │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ BACKEND JAVA    │
                │ Spring Boot     │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ PYTHON / FASTAPI│
                └────────┬────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       CLASIFICACIÓN NLP      CIENCIA DE DATOS
              │                     │
              │                     ▼
              │              PERFIL FINANCIERO
              │                     │
              └──────────┬──────────┘
                         ▼
                FLEXIBILIZACIÓN
                         │
                         ▼
             RECOMMENDATION ENGINE
                    7 REGLAS
                         │
                         ▼
              RECOMENDACIONES
                 ACCIONABLES
________________________________________
📄 Licencia
Proyecto desarrollado para:
Hackathon ONE – Grupo 9 | Alura + Oracle Team 17
Todos los derechos reservados.


