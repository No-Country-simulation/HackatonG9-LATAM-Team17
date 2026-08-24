# 🧠 Sistema Integral de Análisis y Recomendaciones Financieras

### Hackathon ONE – G9 | Alura + Oracle

> Sistema **end-to-end** de análisis financiero que integra **Frontend Web**, **Backend Java/Spring Boot**, **Machine Learning en Python**, **NLP**, **ciencia de datos** y un **motor de recomendaciones basado en reglas de negocio**.

---

## 🎯 Visión general

El proyecto transforma información financiera del usuario, incluyendo **transacciones, ingresos, deudas, ahorro, inversiones, fondo de emergencia y suscripciones**, en un diagnóstico financiero estructurado.

El sistema combina tres grandes capas:

| Capa | Tecnología | Responsabilidad |
|:---|:---|:---|
| 🎨 **Frontend** | HTML, CSS, JavaScript | Interfaz de usuario, formularios, resultados e historial |
| ⚙️ **Backend** | Java 21 + Spring Boot 3.4.2 | API REST, autenticación, persistencia, orquestación e integración |
| 🧠 **Python / IA** | Python 3.11+ + FastAPI + scikit-learn | NLP, clasificación, perfil financiero y recomendaciones |

---

# 🏗️ Arquitectura End-to-End

```text
┌──────────────────────────────────────────────────────────────────┐
│                         🎨 FRONTEND WEB                           │
│                     HTML + CSS + JavaScript                      │
│                                                                  │
│  Registro · Login · Análisis · Clasificación · Historial         │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                          HTTP / JSON
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                       ⚙️ BACKEND JAVA                            │
│                    Spring Boot 3.4.2                             │
│                                                                  │
│  Controllers · Services · Security · Repositories · DTOs         │
└───────────────┬──────────────────────────────┬───────────────────┘
                │                              │
                │ PostgreSQL / H2              │ REST
                ▼                              ▼
┌─────────────────────────┐       ┌────────────────────────────────┐
│      🗄️ BASE DE DATOS   │       │      🤖 MICROSERVICIO PYTHON   │
│                         │       │          FastAPI + ML           │
│  Usuarios               │       │                                │
│  Análisis               │       │  ┌──────────────────────────┐  │
│  Transacciones          │       │  │ 🧠 Clasificador NLP      │  │
└─────────────────────────┘       │  │ TF-IDF + SVM lineal      │  │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ 📊 Ingeniería de         │  │
                                  │  │ características + Perfil │  │
                                  │  │ financiero                │  │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ 🎚️ Profile Flexibility   │  │
                                  │  └────────────┬─────────────┘  │
                                  │               ▼                │
                                  │  ┌──────────────────────────┐  │
                                  │  │ 💡 Recommendation Engine │  │
                                  │  │ 7 reglas de negocio      │  │
                                  │  └──────────────────────────┘  │
                                  └────────────────────────────────┘
```

---

# 📂 Estructura general del proyecto

```text
proyecto/
│
├── 🎨 frontend/
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── analisis.html
│   ├── historial.html
│   ├── css/
│   └── js/
│
├── ⚙️ backend/
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
└── 🤖 python/
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
```

---

# 🎨 1. Frontend

## 📌 Descripción

El frontend proporciona la interfaz gráfica para que el usuario pueda:

- 👤 Registrarse.
- 🔐 Iniciar sesión.
- ⚙️ Consultar y gestionar su cuenta.
- 💰 Ingresar información financiera.
- 💳 Registrar transacciones.
- 📊 Ejecutar un análisis financiero.
- 🧠 Clasificar transacciones individualmente.
- 💡 Consultar recomendaciones.
- 🕒 Consultar el historial de análisis.

### 🛠️ Tecnologías

`HTML5` · `CSS3` · `JavaScript` · `Fetch API` · `REST / JSON`

---

## 📂 Organización

```text
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
```

---

## 🔄 Comunicación con el Backend

El frontend utiliza peticiones HTTP asíncronas mediante `fetch`.

### 🔐 Autenticación

| Método | Endpoint |
|:---:|:---|
| `POST` | `/api/v1/auth/registro` |
| `POST` | `/api/v1/auth/login` |
| `DELETE` | `/api/v1/auth/eliminar` |

### 📊 Análisis financiero

| Método | Endpoint |
|:---:|:---|
| `POST` | `/api/v1/finanzas/analizar` |
| `POST` | `/api/v1/finanzas/clasificar` |
| `GET` | `/api/v1/finanzas/historial/{usuarioId}` |
| `GET` | `/api/v1/finanzas/historial` |

### 🔁 Flujo

```text
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
```

---

## 🔐 Autenticación

### Registro

El usuario proporciona:

```json
{
  "nombre": "Usuario",
  "email": "usuario@email.com",
  "password": "********"
}
```

El frontend envía la información al backend:

```http
POST /api/v1/auth/registro
```

### Login

```http
POST /api/v1/auth/login
```

La respuesta contiene información estructurada de autenticación:

```json
{
  "token": "...",
  "status": "...",
  "id": 1,
  "email": "usuario@email.com"
}
```

---

# ⚙️ 2. Backend — Java + Spring Boot

## 📌 Descripción

El backend funciona como núcleo de la plataforma.

### Responsabilidades

- 🌐 Exponer la API REST.
- 👤 Gestionar usuarios.
- 🔐 Autenticar credenciales.
- 🗄️ Persistir información financiera.
- 📜 Gestionar análisis históricos.
- ✅ Validar datos recibidos.
- 🤖 Comunicarse con el microservicio Python.
- 🧯 Gestionar errores.
- 🛡️ Aplicar mecanismos de resiliencia.

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|:---|:---|
| ☕ Java 21 | Lenguaje principal |
| 🌱 Spring Boot 3.4.2 | Framework |
| 🌐 Spring Web | API REST |
| 🗄️ Spring Data JPA | Persistencia |
| 🔐 Spring Security | Seguridad |
| 🐘 PostgreSQL | Base de datos |
| 🧪 H2 | Base de datos de pruebas |
| 🔗 RestClient | Comunicación con Python |
| ✅ Jakarta Bean Validation | Validación |
| 🔒 BCrypt | Protección de contraseñas |

---

## 📂 Arquitectura por capas

```text
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
```

---

# 📡 API REST del Backend

## 🔐 Autenticación

### Registrar usuario

```http
POST /api/v1/auth/registro
```

Registra un usuario y almacena su contraseña utilizando BCrypt.

### Iniciar sesión

```http
POST /api/v1/auth/login
```

Valida las credenciales y devuelve la información necesaria para la sesión.

### Eliminar cuenta

```http
DELETE /api/v1/auth/eliminar
```

Permite eliminar una cuenta de usuario.

---

## 💰 Análisis financiero

### Analizar perfil

```http
POST /api/v1/finanzas/analizar
```

Envía los datos financieros y las transacciones al microservicio Python.

### Clasificar transacción

```http
POST /api/v1/finanzas/clasificar
```

Permite clasificar una transacción individual mediante modelos entrenados.

### Historial por usuario

```http
GET /api/v1/finanzas/historial/{usuarioId}
```

Devuelve los análisis financieros ordenados desde el más reciente.

### Historial general

```http
GET /api/v1/finanzas/historial
```

Obtiene automáticamente el historial del primer usuario activo del sistema.

---

## 🔐 Configuración segura

Las credenciales de la base de datos no deben almacenarse directamente en el código.

### Variables utilizadas

```properties
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
PORT_USER=8080
```

### Ejemplo

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/salud_financiera
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

**Puerto predeterminado:** `8080`

---

# 🤖 Integración Backend ↔ Python

El backend Java consume el microservicio Python mediante `RestClient`.

```text
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
```

## Endpoint de análisis general

```http
POST /api/v1/analizar-perfil
```

### Recibe

- Ingresos
- Deudas
- Ahorro
- Inversiones
- Fondo de emergencia
- Suscripciones
- Transacciones

### Devuelve

- Probabilidades
- Perfil financiero
- Resumen de gastos
- Recomendaciones

## Endpoint de clasificación

```http
POST /api/v1/clasificar-transaccion
```

Recibe una transacción y devuelve su categoría y confiabilidad.

---

# 🛡️ Fallback

El backend implementa un mecanismo de respaldo para evitar que la caída del microservicio Python provoque una caída completa de la aplicación.

```text
                 ┌── Python responde ──► Resultado Modelo
                 │
Backend ─────────┤
                 │
                 └── Python falla ─────► Resultado fallback
```

Esto permite mantener una respuesta funcional incluso ante problemas temporales de red o disponibilidad del servicio de IA.

---

# 🧠 3. Python — Machine Learning + FastAPI

## 📌 Responsabilidades

El módulo Python concentra la inteligencia del sistema:

1. 🧠 Clasificación NLP de transacciones.
2. 📊 Ingeniería de características financieras.
3. 💼 Clasificación del tipo de ingreso.
4. 🎯 Predicción del perfil financiero.
5. 🎚️ Flexibilización del perfil.
6. 💡 Motor de recomendaciones.
7. 📡 Exposición mediante FastAPI.

---

# 🧠 3.1 Clasificador SVM de gastos

El clasificador recibe la descripción breve de una transacción —por ejemplo, `renovación mensual de Netflix`— y determina a cuál de las **12 categorías financieras** pertenece. Es un problema de **clasificación supervisada multiclase**: durante el entrenamiento se conocen las categorías correctas y el modelo aprende a separar sus patrones lingüísticos.

La única variable predictora es `descripcion`. Los campos `valor` y `fecha` se validan para cumplir el contrato de integración, pero no entran al modelo; así se evita aprender límites monetarios o patrones estacionales frágiles entre países, monedas y usuarios.

El sistema no clasifica mediante reglas `if/else`. Combina representaciones TF-IDF con señales léxicas financieras y utiliza una **SVM lineal calibrada** para decidir la categoría. Este enfoque se adapta especialmente bien al texto porque trabaja de forma eficiente con vectores dispersos de alta dimensión.

## 🔬 Arquitectura

```text
Descripción de la transacción
              │
              ▼
 Normalización y corrección
  ortográfica conservadora
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
 TF-IDF de  TF-IDF de  Señales léxicas
 palabras   caracteres  financieras
  1–2 g.      3–5 g.
      └───────┼────────┘
              ▼
       Vector disperso
              │
              ▼
   SVM lineal multiclase
      LinearSVC (C = 2)
              │
              ▼
 Calibración sigmoide agrupada
              │
              ▼
 Ajuste de temperatura (0.70)
              │
              ▼
     Categoría + confiabilidad
```

## ⚙️ Configuración

| Componente | Configuración |
|:---|:---|
| Normalización | Minúsculas, eliminación de acentos y puntuación, conservación de dígitos y compactación de espacios |
| Corrección ortográfica | Conservadora y condicionada a que la señal apunte a una sola categoría |
| TF-IDF de palabras | Unigramas y bigramas (1–2 gramos) |
| TF-IDF de caracteres | Fragmentos de 3–5 caracteres |
| Señales léxicas | Términos financieros incorporados como características; no sustituyen al modelo |
| Clasificador | `LinearSVC` multiclase con `C = 2` |
| Calibración | Sigmoide con 5 folds agrupados + temperatura `0.70` en validación independiente |

---

# 📊 Categorías financieras

| Categoría | Ejemplos |
|:---|:---|
| 🍔 **ALIMENTACION** | supermercado, restaurante, abarrotes |
| 📈 **APORTE_INVERSIONES** | acciones, ETF, AFP, broker, cripto |
| 🎓 **EDUCACION** | universidad, curso, matrícula |
| ☕ **GASTOS_HORMIGA** | café, snack, golosina |
| 💰 **INGRESOS** | sueldo, salario, honorarios |
| 🎮 **OCIO** | cine, concierto, videojuego |
| 📦 **OTROS** | retiro, ropa, impuesto |
| 🏥 **SALUD** | farmacia, clínica, dentista |
| 💡 **SERVICIOS** | electricidad, internet, agua |
| 📺 **SUSCRIPCIONES** | Netflix, Spotify, streaming |
| 🚕 **TRANSPORTE** | Uber, taxi, gasolina, peaje |
| 🏠 **VIVIENDA** | alquiler, hipoteca, condominio |

---

# 🎯 Política de confianza

`LinearSVC` produce distancias respecto de los hiperplanos de decisión, no probabilidades nativas. Para devolver una `confiabilidad` interpretable, sus márgenes se convierten en probabilidades mediante calibración sigmoide con folds agrupados y después se ajustan con una temperatura de **0.70** elegida sobre 94 casos de validación independientes.

La misma partición fijó un umbral interno de **0.48** para la aceptación automática, con un objetivo de 93% de precisión entre los casos aceptados. Una confianza inferior debe tratarse como señal de revisión, no como certeza ni como una conversión automática a `OTROS`. El contrato del backend conserva siempre la mejor categoría y su confiabilidad.

Para auditoría interna, el clasificador también conserva:

- Margen
- Cobertura léxica
- Top-3
- Motivo de rechazo

---

# 📈 Evaluación y selección del modelo

Se compararon cinco familias compatibles con matrices dispersas utilizando `StratifiedGroupKFold` de cinco folds. Las variaciones de un mismo concepto permanecen en el mismo grupo, por lo que no pueden aparecer simultáneamente en entrenamiento y prueba.

| Modelo | F1 macro agrupado | Exactitud agrupada |
|:---|---:|---:|
| **SVM lineal** | **73.33%** | **73.50%** |
| Regresión logística | 73.22% | 72.55% |
| SGD logístico | 72.53% | 72.34% |
| Naive Bayes complementario | 72.35% | 73.58% |
| Bosque aleatorio | 68.23% | 68.67% |

### ¿Por qué se seleccionó SVM lineal?

- Obtuvo la mayor **F1 macro agrupada (73.33%)**, métrica que concede el mismo peso a cada categoría.
- Se comporta bien en espacios TF-IDF de alta dimensión y con gran cantidad de valores cero.
- Su frontera lineal ofrece una inferencia más viable para 100,000 textos que KNN o una SVM con kernel RBF.
- Sus márgenes pueden calibrarse para producir la confiabilidad requerida por el contrato JSON.
- La selección sigue una regla reproducible: elegir la mayor F1 macro agrupada entre los modelos con un flujo probabilístico aprobado.

---

# 📚 Datos de entrenamiento

El entrenamiento final utiliza:

| Dataset | Cantidad |
|:---|---:|
| Descripciones únicas | **100,000** |
| Textos manuales curados | **118** |
| Deformaciones ortográficas sistemáticas | **4,820** |
| Variaciones sintéticas de redacción y formato bancario | **95,062** |
| Casos de calibración | **94** |
| Holdout final | **72** |

La generación es **determinista y reproducible**: combina conceptos financieros con formatos habituales de estados de cuenta, ruido textual y errores ortográficos controlados. Cada variación conserva el grupo de su concepto original para evitar fuga semántica, y el hash SHA-256 del conjunto se registra dentro del artefacto entrenado.

> ⚠️ Las 100,000 muestras no representan 100,000 transacciones reales independientes. La aumentación enseña tolerancia a cambios de redacción y ortografía, pero no reemplaza datos reales anonimizados de distintos países, bancos y usuarios.

---

# 📊 Resultados del holdout

| Métrica | Resultado |
|:---|---:|
| 🎯 Exactitud | **97.22%** |
| 📊 F1 macro | **97.20%** |
| 📉 Log-loss | **0.0886** |
| 📐 Brier multiclase | **0.0360** |
| 📏 ECE | **4.29%** |
| 🤖 Cobertura automática | **98.61%** |
| ✅ Precisión entre aceptadas | **98.59%** |

> ⚠️ El holdout es pequeño y debe considerarse evidencia inicial, no una garantía de rendimiento en producción.

La batería de regresión de la versión 3.3 también superó 120 casos semánticos, 600 transformaciones con ruido bancario, 960 deformaciones ortográficas sistemáticas y 29 errores dirigidos. Estos son controles conocidos de robustez, no ejemplos independientes; para estimar la generalización hacia conceptos nuevos debe considerarse principalmente la validación agrupada, cercana al 73% de F1 macro.

---

# 📦 Contrato JSON del clasificador

## Entrada individual

```json
{
  "descripcion": "Netflix",
  "valor": 15.0,
  "fecha": "2026-08-07"
}
```

## Salida individual

```json
{
  "categoria": "SUSCRIPCIONES",
  "confiabilidad": 0.999
}
```

## Entrada por lotes

```json
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
```

## Respuesta

```json
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
```

## Contrato de variables

| Campo | Tipo | Uso |
|:---|:---|:---|
| `descripcion` | Texto no vacío | Variable predictora |
| `valor` | Número finito | Validación; no entra al modelo |
| `fecha` | ISO-8601 | Validación; no entra al modelo |

> El modelo aprende exclusivamente de `descripcion`.

---

# 📊 3.2 Ciencia de Datos — Perfil Financiero

## 🎯 Objetivo

Se desarrolla un sistema de análisis financiero utilizando **Machine Learning** para procesar transacciones de un usuario, identificar sus tipos de ingreso y clasificar su perfil financiero.

El sistema transforma información de transacciones individuales en diferentes características financieras que posteriormente son utilizadas para determinar el comportamiento financiero general del usuario.

Los principales procesos son:

1. Clasificación de ingresos.
2. Identificación del tipo de ingreso.
3. Generación de características financieras.
4. Clasificación del perfil financiero.
5. Obtención de probabilidades para cada perfil.

---

## 🧠 ¿Cómo funciona?

El funcionamiento general del proyecto es:

```text
Transacciones del usuario
          ↓
Clasificación de ingresos
          ↓
Identificación del tipo de ingreso
          ↓
Generación de características financieras
          ↓
Modelo de perfil financiero
          ↓
Perfil financiero
```

El sistema comienza con las transacciones realizadas por el usuario y posteriormente transforma estos datos hasta obtener una clasificación general de su situación financiera.

---

## 3.2.1. 📋 Entrada de datos

El sistema trabaja con transacciones financieras que contienen información como:

- Fecha.
- Descripción.
- Categoría.
- Valor.
- Tipo de ingreso.

Por ejemplo:

```{python}
datos = {
    "fecha": [
        "2026-07-01",
        "2026-07-02",
        "2026-07-03",
        "2026-07-04",
        "2026-07-05"
    ],

    "descripcion": [
        "Sueldo mensual recibido",
        "Mercado Éxito",
        "Pago de energía",
        "Honorarios por consultoría",
        "Netflix"
    ],

    "categoria": [
        "Ingresos",
        "Alimentacion",
        "Servicios",
        "Ingresos",
        "Ocio"
    ],

    "valor": [
        3000,
        180,
        95,
        850,
        28
    ]
}
```

Los datos se convierten posteriormente en un `DataFrame`:

```{python}
df_usuario <- as.data.frame(datos)
```

> **Nota:** Los ejemplos anteriores representan la estructura de los datos utilizados por el proyecto. El código original del análisis está desarrollado en Python.

---

## 3.2.2. 🔎 Identificación de ingresos

El sistema identifica cuáles de las transacciones corresponden a ingresos.

Por ejemplo:

| Transacción | Categoría | ¿Es ingreso? |
|:---|:---|:---:|
| Sueldo mensual recibido | Ingresos | ✓ |
| Mercado Éxito | Alimentación | ✗ |
| Pago de energía | Servicios | ✗ |
| Honorarios por consultoría | Ingresos | ✓ |
| Netflix | Ocio | ✗ |

Las transacciones clasificadas como `Ingresos` pasan al siguiente proceso.

---

## 3.2.3. 🤖 Clasificación del tipo de ingreso

Para clasificar los ingresos se utilizan dos modelos previamente entrenados:

```text
modelo_tipo_ingreso_1.pkl
modelo_tipo_ingreso_2.pkl
```

Los modelos se cargan mediante `joblib`.

```{python}
modelo_tipo_ingreso_cat = joblib.load(
    "modelos/modelo_tipo_ingreso_1.pkl"
)

modelo_tipo_ingreso = joblib.load(
    "modelos/modelo_tipo_ingreso_2.pkl"
)
```

El primer modelo analiza la descripción de la transacción.

Por ejemplo:

```text
"Sueldo mensual recibido"
            ↓
modelo_tipo_ingreso_1
            ↓
Salario
```

Otro ejemplo:

```text
"Honorarios por consultoría"
            ↓
modelo_tipo_ingreso_1
            ↓
Independiente
```

---

## 3.2.4. 👤 Tipo de ingreso del usuario

Después de clasificar las diferentes transacciones, el sistema analiza los tipos de ingreso encontrados.

La clasificación final puede ser:

- **Salario**
- **Independiente**
- **Mixto**
- **Sin ingresos registrados**

La lógica utilizada es:

```text
No existen ingresos
        ↓
Sin ingresos registrados

Solo existe Salario
        ↓
Salario

Solo existe Independiente
        ↓
Independiente

Existen diferentes tipos
        ↓
Mixto
```

Por ejemplo:

```text
Sueldo mensual recibido
        ↓
Salario

Honorarios por consultoría
        ↓
Independiente

Resultado:
Mixto
```

---

## 3.2.5. 📊 Generación de características financieras

Después del procesamiento de las transacciones, se generan las variables utilizadas por el modelo de perfil financiero.

Entre las principales características se encuentran:

```text
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
```

Estas variables permiten representar diferentes aspectos del comportamiento financiero del usuario.

---

## 3.2.6. 🧮 Generación de características del usuario

El proyecto utiliza una función para transformar la información financiera y las transacciones en las variables necesarias para el modelo.

Un ejemplo de entrada es:

```{python}
datos2 = generar_caracteristicas_usuario(
    ingreso_mensual=3000,
    deuda_total=1000,
    objetivo_presupuesto=500,
    pago_prestamo=200,
    servicios_suscripcion=2,
    fondo_emergencia=1500,
    monto_inversion=300,
    transacciones=transacciones
)
```

La función genera un conjunto estructurado de características:

```text
Ingreso mensual
Gasto mensual total
Tasa de ahorro
Relación deuda/ingreso
Pago de préstamo
Monto de inversión
Fondo de emergencia
Cantidad de transacciones
Gastos esenciales
Gastos discrecionales
Tipo de ingreso
Estado del flujo de caja
Nivel de estrés financiero
Ahorro real
...
```

Estas características son las que finalmente recibe el modelo de perfil financiero.

---

## 3.2.7. 🧠 Clasificación del perfil financiero

El modelo de perfil financiero se encuentra en:

```text
modelos/perfil_financiero.pkl
```

Se carga de la siguiente manera:

```{python}
modelo_pf = joblib.load(
    "modelos/perfil_financiero.pkl"
)
```

Posteriormente, las características del usuario son enviadas al modelo:

```{python}
perfil_financiero = modelo_pf.predict(datos2)
```

El modelo puede clasificar al usuario en uno de los siguientes perfiles:

| Perfil | Indicador |
|:---|:---:|
| Excelente | 🟢 |
| Saludable | 🟢 |
| Estable | 🟡 |
| En observación | 🟠 |
| En riesgo | 🔴 |
| Crítico | ⚫ |

---

## 3.2.8. 📈 Probabilidad de cada perfil

Además de determinar el perfil financiero, el código obtiene la probabilidad asociada a cada categoría.

Para esto utiliza:

```{python}
probabilidades = modelo_pf.predict_proba(datos2)[0]
```

Después se relacionan las probabilidades con las clases del modelo:

```{python}
clases = modelo_pf.classes_

resultado = dict(
    zip(clases, probabilidades)
)
```

Un resultado puede tener la siguiente estructura:

```text
Crítico          → 1.3 %
En observación   → 5.3 %
En riesgo        → 2.0 %
Estable          → 20.7 %
Excelente        → 39.7 %
Saludable        → 31.0 %
```

El modelo seleccionaría como resultado:

```text
🟢 Excelente
```

porque es la categoría con mayor probabilidad.

---

## 🧪 Ejemplo completo

Supongamos que un usuario tiene las siguientes transacciones:

| Descripción | Categoría | Valor |
|:---|:---|---:|
| Sueldo mensual recibido | Ingresos | 3000 |
| Mercado Éxito | Alimentación | 180 |
| Pago de energía | Servicios | 95 |
| Honorarios por consultoría | Ingresos | 850 |
| Cine | Ocio | 28 |
| Gasolina | Transporte | 70 |
| Aporte a inversión | Inversiones | 200 |

### Paso 1 — Identificación de ingresos

El sistema identifica:

```text
Sueldo mensual recibido
Honorarios por consultoría
```

---

### Paso 2 — Clasificación

Los modelos procesan las descripciones:

```text
Sueldo mensual recibido
        ↓
Salario

Honorarios por consultoría
        ↓
Independiente
```

---

### Paso 3 — Tipo de ingreso

Como existen dos tipos de ingreso:

```text
Salario
Independiente
```

el sistema determina:

```text
Tipo de ingreso = Mixto
```

---

### Paso 4 — Características financieras

La información se transforma en variables como:

```text
Ingreso mensual
Gasto mensual total
Tasa de ahorro
Deuda
Pago de préstamo
Monto de inversión
Fondo de emergencia
Gastos esenciales
Gastos discrecionales
Cantidad de transacciones
Tipo de ingreso
Estado del flujo de caja
Nivel de estrés financiero
Ahorro real
```

---

### Paso 5 — Perfil financiero

Las características son enviadas al modelo:

```text
Características financieras
            ↓
perfil_financiero.pkl
            ↓
Probabilidades
            ↓
Perfil financiero
```

Por ejemplo:

```text
Crítico          → 1.3 %
En observación   → 5.3 %
En riesgo        → 2.0 %
Estable          → 20.7 %
Excelente        → 39.7 %
Saludable        → 31.0 %
```

Resultado:

```text
🟢 Perfil financiero: Excelente
```

---

## 🔄 Flujo completo del sistema

```text
┌───────────────────────────────┐
│       TRANSACCIONES           │
│                               │
│ Fecha                         │
│ Descripción                   │
│ Categoría                     │
│ Valor                         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ CLASIFICACIÓN DE INGRESOS     │
│                               │
│ modelo_tipo_ingreso_1.pkl     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ TIPO DE INGRESO               │
│                               │
│ Salario                       │
│ Independiente                 │
│ Mixto                         │
│ Sin ingresos registrados      │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ CARACTERÍSTICAS FINANCIERAS   │
│                               │
│ Ingresos                      │
│ Gastos                        │
│ Ahorro                        │
│ Deuda                         │
│ Inversiones                   │
│ Flujo de caja                 │
│ Estrés financiero             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ MODELO DE PERFIL FINANCIERO   │
│                               │
│ perfil_financiero.pkl         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       PERFIL FINANCIERO       │
│                               │
│ 🟢 Excelente                  │
│ 🟢 Saludable                 │
│ 🟡 Estable                   │
│ 🟠 En observación            │
│ 🔴 En riesgo                 │
│ ⚫ Crítico                   │
└───────────────────────────────┘
```

---

## 🤖 Modelos utilizados

### `modelo_tipo_ingreso_1.pkl`

Clasifica la descripción de una transacción de ingreso.

```text
Descripción de la transacción
             ↓
modelo_tipo_ingreso_1.pkl
             ↓
Categoría del ingreso
```

### `modelo_tipo_ingreso_2.pkl`

Utiliza la clasificación anterior para determinar el tipo general de ingreso.

```text
Categoría del ingreso
             ↓
modelo_tipo_ingreso_2.pkl
             ↓
Salario / Independiente
```

Posteriormente, el sistema determina si el usuario tiene ingresos de tipo `Salario`, `Independiente`, `Mixto` o no tiene ingresos registrados.

### `perfil_financiero.pkl`

Clasifica al usuario utilizando las características financieras generadas.

```text
Características financieras
             ↓
perfil_financiero.pkl
             ↓
Perfil financiero
```

---

# 🛠️ Tecnologías

- **Python 3.12.2**
- **Pandas**
- **NumPy**
- **Scikit-learn**
- **Joblib**
- **Jupyter Notebook**

---

# 📌 Resumen

El proyecto realiza una transformación progresiva de los datos:

```text
Transacciones
      ↓
Clasificación de ingresos
      ↓
Tipo de ingreso
      ↓
Características financieras
      ↓
Modelo de Machine Learning
      ↓
Perfil financiero
```

El resultado permite pasar de información financiera individual, como una lista de transacciones, a una clasificación general del comportamiento financiero del usuario.

---

# 💡 3.3 Recommendation Engine

El motor de recomendaciones **no utiliza Machine Learning**.

Su inteligencia está implementada mediante **7 reglas de negocio programadas en Python**.

## 🔄 Flujo

```text
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
```

## 7 reglas

| # | Regla | Prioridad | Impacto |
|---:|:---|:---:|:---|
| 1 | 💰 Ahorro | 2–3 | Medio/Bajo |
| 2 | 💳 Endeudamiento | 1–3 | Alto/Bajo |
| 3 | 🛟 Fondo de emergencia | 1–4 | Alto/Bajo |
| 4 | 📉 Flujo de caja | 1–2 | Alto/Medio |
| 5 | 📺 Suscripciones | 3 | Bajo |
| 6 | 📊 Perfil financiero | 0–4 | Alto/Bajo |
| 7 | 🧠 Confianza del modelo | 4 | Informativo |

### Cada recomendación contiene

- Categoría
- Prioridad
- Título
- Explicación
- Acción
- Impacto
- Score
- Fecha de generación

**Score:** `0.0 – 1.0`

---

# 🔄 Adaptador financiero

`financial_data_adapter.py` adapta las variables generadas por el modelo de ciencia de datos a los nombres y formatos requeridos por las reglas.

Calcula, entre otras:

- `meses_reserva`
- `ratio_suscripciones`

Esto permite mantener desacoplados los modelos de Machine Learning y el motor de reglas.

---

# 🎚️ Flexibilización del perfil

`profile_flexibility.py` ajusta la etiqueta generada por Machine Learning cuando existen indicadores financieros especialmente relevantes.

### Ejemplo 1

```text
Si probabilidad < 0.55
y deuda > 50%
        ↓
     Crítico
```

### Ejemplo 2

```text
Si tasa_ahorro ≥ 25%
y reserva ≥ 6 meses
        ↓
    Excelente
```

---

# 📡 3.4 API FastAPI

## Endpoint principal

```http
POST /analizar-perfil
```

```http
Content-Type: application/json
```

La API Python funciona como punto de integración entre:

```text
Clasificador NLP
      +
Ciencia de Datos
      +
Perfil financiero
      +
Recommendation Engine
```

---

## 📥 Request

```json
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
```

## 📤 Response

```json
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
```

---

# 🔄 Flujo completo del análisis

```text
1.  👤 Usuario introduce datos
          │
          ▼
2.  🎨 Frontend
          │
          ▼
3.  ⚙️ Backend Java
          │
          ▼
4.  🤖 API Python
          │
          ▼
5.  🧠 Clasificación NLP
          │
          ▼
6.  📊 Ingeniería de 17 características
          │
          ▼
7.  🎯 Predicción del perfil financiero
          │
          ▼
8.  🎚️ Flexibilización del perfil
          │
          ▼
9.  💡 Recommendation Engine
          │
          ▼
10. 📦 Respuesta JSON
          │
          ▼
11. 🗄️ Backend persiste el análisis
          │
          ▼
12. 🖥️ Frontend muestra resultados
```

---

# 📦 Artefactos de Machine Learning

Los artefactos `.pkl` pertenecen exclusivamente a los módulos de Machine Learning.

```text
modelos/
│
├── clasificador_gastos.pkl
├── clasificador_gastos.pkl.sha256
├── modelo_perfil_financiero.pkl
├── modelo_tipo_ingreso_1.pkl
└── modelo_tipo_ingreso_2.pkl
```

| Archivo | Contenido |
|:---|:---|
| `clasificador_gastos.pkl` | TF-IDF + SVM lineal calibrada (`LinearSVC`) + metadatos de entrenamiento |
| `clasificador_gastos.pkl.sha256` | Checksum de integridad |
| `modelo_perfil_financiero.pkl` | Clasificador del perfil |
| `modelo_tipo_ingreso_1.pkl` | Tipo de ingreso v1 |
| `modelo_tipo_ingreso_2.pkl` | Tipo de ingreso v2 |

> El Recommendation Engine no necesita `.pkl`, ya que está construido con reglas de negocio en Python puro.

---

# 🛡️ Seguridad y robustez

## 🧠 Clasificador NLP

- Validación anti-fuga entre splits.
- Detección de descripciones contradictorias.
- Prevención de duplicados.
- Checksum SHA-256.
- Comparación mediante `hmac.compare_digest`.
- Validación de versión del artefacto.
- Detección de incompatibilidad de scikit-learn.
- Serialización atómica.
- `fsync`.
- Política de confianza multicriterio.

## 📊 Ciencia de Datos

- Aumento sintético determinista.
- Reproducibilidad.
- Grupos trazables.
- Validación cruzada sin fuga semántica.
- Validación estricta de columnas.
- Validación de categorías.

## 💡 Recommendation Engine

- Adaptador de variables.
- Alias de compatibilidad.
- Cálculo defensivo de variables derivadas.
- Ordenamiento determinista.
- Flexibilización dinámica del perfil.

## ⚙️ Backend

- BCrypt para credenciales.
- Bean Validation.
- Manejo global de excepciones.
- Variables de entorno para secretos.
- CORS configurado.
- Fallback ante indisponibilidad del servicio Python.

---

# 🚀 Uso del módulo Python

## Probar el clasificador entrenado

El archivo de demostración carga `modelos/clasificador_gastos.pkl`, valida su integridad, procesa `ejemplos/entrada_transacciones.json` y conserva el orden de las transacciones en la salida.

```powershell
.\.venv_hackathon\Scripts\python.exe probar_modelo_json.py
```

El resultado se escribe en `ejemplos/salida_transacciones.json` con exactamente los campos `categoria` y `confiabilidad` acordados con el backend.

---

## Clasificar un JSON

```python
from clasificador.contrato_json import clasificar_payload
from clasificador.modelo import cargar_modelo

modelo = cargar_modelo(
    "modelos/clasificador_gastos.pkl",
    verificar_integridad=True
)

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
```

---

## 🧪 Entrenar el clasificador

`entrenar.py` ejecuta el flujo completo y reproducible: construye los datos, compara las cinco familias, selecciona la regularización, calibra la SVM, fija el umbral interno, evalúa el holdout y guarda el PKL junto con sus reportes JSON.

```powershell
.\.venv_hackathon\Scripts\python.exe entrenar.py
```

El holdout se utiliza únicamente al final y nunca se copia al entrenamiento.

---

# 💡 Ejecutar Recommendation Engine

```python
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
```

---

# 🧪 Reproducción del modelo NLP

Los dos ejecutables principales son:

- `entrenar.py`
- `probar_modelo_json.py`

## Probar el modelo

### 1. Editar

```text
ejemplos/entrada_transacciones.json
```

### 2. Ejecutar

```text
probar_modelo_json.py
```

### 3. Revisar

```text
ejemplos/salida_transacciones.json
```

---

# 🐍 Configurar el entorno Python

## Crear entorno virtual

```powershell
py -3.13 -m venv .venv_hackathon
```

## Instalar dependencias

```powershell
.\.venv_hackathon\Scripts\python.exe -m pip install -r requirements.txt
```

## Ejecutar pruebas

```powershell
.\.venv_hackathon\Scripts\python.exe -m pytest -q
```

## Ejecutar FastAPI

```powershell
uvicorn api.api_router:router --host 0.0.0.0 --port 8000
```

---

# 📁 Estructura detallada del módulo Python

```text
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
```

---

# 🧰 Tecnologías

## 🎨 Frontend

`HTML5` · `CSS3` · `JavaScript` · `Fetch API` · `REST / JSON`

## ⚙️ Backend

`Java 21` · `Spring Boot 3.4.2` · `Spring Web` · `Spring Data JPA` · `Spring Security` · `PostgreSQL` · `H2` · `RestClient` · `Jakarta Validation` · `BCrypt`

## 🤖 Python / IA

`Python 3.11+` · `FastAPI` · `Pydantic` · `scikit-learn 1.3+` · `NumPy` · `SciPy` · `Pandas` · `Joblib` · `Jupyter Notebook` · `Unicodedata`

---

# 🧩 Responsabilidades por componente

| Componente | Responsable | Tecnología |
|:---|:---|:---|
| 🎨 Frontend | Frontend | HTML/CSS/JS |
| 🌐 API principal | Backend | Java/Spring Boot |
| 🗄️ Persistencia | Backend | JPA/PostgreSQL |
| 🔐 Seguridad | Backend | Spring Security + BCrypt |
| 🧠 Clasificador NLP | Data Scientist | Python + scikit-learn |
| 📊 Ingeniería de características | Data Scientist | Python + Pandas |
| 🎯 Perfil financiero | Data Scientist | Machine Learning |
| 💼 Tipo de ingreso | Data Scientist | Machine Learning |
| 🎚️ Flexibilización | Data Scientist | Python |
| 💡 Recommendation Engine | Data Scientist | Python |
| 📡 API IA | Data Scientist | FastAPI |
| 🔗 Integración Java ↔ Python | Backend | RestClient |

---

# 🔒 Consideraciones de seguridad

> [!WARNING]
> Los archivos **Pickle (`.pkl`) deben cargarse únicamente desde fuentes confiables**. La deserialización de Pickle puede ejecutar código arbitrario.

El clasificador implementa un **checksum SHA-256** para detectar modificaciones del artefacto antes de cargarlo.

Sin embargo, la integridad criptográfica **no convierte en confiable una fuente desconocida**: solo deben utilizarse artefactos provenientes de una fuente confiable.

Las credenciales de base de datos deben mantenerse mediante variables de entorno y **nunca incluirse en el repositorio**.

---

# 📈 Limitaciones y mejoras futuras

El proyecto constituye un **MVP funcional**, por lo que existen oportunidades para mejorar su comportamiento en producción:

- [ ] Incorporar transacciones reales anonimizadas.
- [ ] Incrementar el tamaño del holdout.
- [ ] Evaluar datos reales de diferentes bancos y países.
- [ ] Incorporar correcciones proporcionadas por usuarios.
- [ ] Vigilar deriva de comercios y nuevas suscripciones.
- [ ] Incorporar nuevos regionalismos y abreviaturas.
- [ ] Recalibrar periódicamente las probabilidades.
- [ ] Analizar especialmente confusiones entre:
  - Alimentación / Vivienda.
  - Ocio / Otros.
- [ ] Mejorar la autenticación y autorización para un entorno productivo.
- [ ] Restringir CORS a dominios conocidos en producción.
- [ ] Implementar observabilidad y métricas de disponibilidad del microservicio Python.

---

# 🏆 Aporte del proyecto

> **Transformamos datos financieros dispersos en un diagnóstico financiero estructurado y en recomendaciones personalizadas, priorizadas y accionables.**

```text
                 💰 DATOS FINANCIEROS
                         │
                         ▼
                 ┌─────────────────┐
                 │    🎨 FRONTEND  │
                 │    HTML/CSS/JS  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ ⚙️ BACKEND JAVA │
                 │  Spring Boot    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ 🤖 PYTHON /     │
                 │    FASTAPI      │
                 └────────┬────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
          🧠 CLASIFICACIÓN    📊 CIENCIA
               NLP             DE DATOS
                 │                 │
                 │                 ▼
                 │          🎯 PERFIL FINANCIERO
                 │                 │
                 └────────┬────────┘
                          ▼
                   🎚️ FLEXIBILIZACIÓN
                          │
                          ▼
                 💡 RECOMMENDATION ENGINE
                         7 REGLAS
                          │
                          ▼
                  🚀 RECOMENDACIONES
                     ACCIONABLES
```

---

# 📄 Licencia

Proyecto desarrollado para:

### 🏆 Hackathon ONE – Grupo 9 | Alura + Oracle Team 17

**Todos los derechos reservados.**
