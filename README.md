# 💰 Motor de Recomendaciones Financieras

Módulo de recomendaciones del proyecto **Financiera Saludable** — Hackathon ONE G9 LATAM (Alura + Oracle).

Este módulo es responsable de transformar los resultados obtenidos por los modelos de Machine Learning y los indicadores financieros del usuario en **recomendaciones concretas, priorizadas, explicadas y accionables**.

> **Los modelos de Machine Learning determinan el perfil financiero y clasifican las transacciones. Este módulo toma esos resultados y decide qué recomendaciones debe recibir el usuario.**

---

## 👨‍💻 Mi aporte al proyecto

### Mauricio Medina — Data & Backend / Recommendation Engine

Mi responsabilidad dentro del proyecto fue desarrollar la **capa de recomendaciones financieras**.

El objetivo fue construir un componente capaz de recibir:

* Perfil financiero predicho.
* Probabilidad de la predicción.
* Información financiera del usuario.
* Indicadores derivados.
* Resultados de clasificación de transacciones.

Y convertirlos en:

* Recomendaciones personalizadas.
* Prioridades.
* Explicaciones.
* Acciones concretas.
* Impacto esperado.
* Un resultado estructurado para ser consumido por una API REST.

### Mi componente responde a una pregunta diferente a la del Machine Learning:

**Machine Learning:**

> ¿Cuál es el perfil financiero del usuario?

**Motor de recomendaciones:**

> ¿Qué debería hacer el usuario teniendo en cuenta su situación financiera?

---

# 🎯 Problema que resuelve

Conocer el perfil financiero de una persona no es suficiente.

Por ejemplo, un modelo puede determinar que un usuario se encuentra **"En riesgo"**, pero el sistema todavía necesita determinar:

* ¿Por qué está en riesgo?
* ¿Qué problema financiero debe atender primero?
* ¿Qué acción debería realizar?
* ¿Qué tan urgente es?
* ¿Qué impacto puede tener esa acción?

El motor de recomendaciones convierte la información financiera en **orientación práctica para el usuario**.

```text
Datos financieros
       │
       ▼
Machine Learning
       │
       ▼
Perfil financiero + probabilidad
       │
       ▼
Indicadores financieros
       │
       ▼
Reglas de negocio
       │
       ▼
Priorización
       │
       ▼
Recomendaciones personalizadas
       │
       ▼
API REST / Frontend
```

---

# 🏗️ Rol dentro de la arquitectura

```text
Transacciones + datos financieros
                │
                ▼
        Modelos de Machine Learning
        ├── clasificador_gastos.pkl
        └── perfil_financiero.pkl
                │
                ▼
       profile_flexibility.py
       Validación y ajuste del perfil
                │
                ▼
       financial_data_adapter.py
       Normalización y variables derivadas
                │
                ▼
       recommendation_engine.py
       Motor principal de recomendaciones
                │
                ▼
       recommendation_rules.py
       7 reglas de negocio
                │
                ▼
       Priorización de recomendaciones
                │
                ▼
       recommendation_serializer.py
                │
                ▼
              JSON
                │
                ▼
       api_router.py
       POST /analizar-perfil
```

---

# 📂 Estructura del módulo

```text
src/
│
├── financial_processor.py
├── profile_flexibility.py
├── financial_data_adapter.py
├── recommendation_rules.py
├── recommendation_engine.py
├── recommendation_models.py
├── recommendation_serializer.py
├── recommendation_service.py
├── schemas.py
├── api_router.py
└── json_loader.py

main.py
requirements.txt

tests/
├── test_financial_data_adapter.py
├── test_recommendation_engine.py
└── conftest.py
```

---

# 🔧 Componentes desarrollados

## `financial_processor.py`

Orquesta la interacción con los modelos de Machine Learning.

Su función dentro del flujo es:

1. Recibir las transacciones.
2. Clasificar las transacciones.
3. Obtener el perfil financiero.
4. Obtener las probabilidades correspondientes.
5. Entregar los resultados al sistema de recomendaciones.

Este componente permite conectar los resultados del Machine Learning con la lógica desarrollada en el motor.

---

## `profile_flexibility.py`

Implementa una capa de validación del perfil financiero.

La predicción del modelo puede presentar incertidumbre, especialmente cuando la probabilidad asociada a la clase predicha es baja.

Por eso se incorporó una capa que contrasta la predicción con indicadores financieros reales.

### Ejemplo

Si el modelo predice:

```text
Perfil: En riesgo
Probabilidad: 52%
```

pero los indicadores muestran:

```text
Deuda controlada
Reserva suficiente
Ahorro positivo
```

el sistema puede ajustar la clasificación hacia:

```text
En observación
```

Esto permite evitar que una predicción con baja confianza se convierta directamente en una conclusión rígida para el usuario.

### Reglas principales

* Confianza menor al **55%** → recalcular el perfil mediante indicadores financieros.
* Perfil **"En riesgo"** con indicadores que no representan riesgo → ajustar a **"En observación"**.
* Perfil **"Estable"** con indicadores significativamente mejores → posibilidad de subir a **"Saludable"** o **"Excelente"**.

---

# 🔄 `financial_data_adapter.py`

Se encarga de adaptar los datos provenientes del pipeline financiero al formato requerido por el motor de recomendaciones.

Entre sus responsabilidades están:

* Normalizar nombres de variables.
* Adaptar estructuras de datos.
* Calcular variables derivadas.
* Mantener un contrato interno consistente para las reglas.

### Variables derivadas

#### `meses_reserva`

Permite estimar cuántos meses de gastos puede cubrir el fondo de emergencia disponible.

#### `ratio_suscripciones`

Calcula el peso de las suscripciones respecto al ingreso mensual.

#### `ahorro_real`

Permite determinar si el usuario realmente está generando capacidad de ahorro a partir de sus ingresos y gastos.

Esto evita que las reglas tengan que encargarse directamente de transformar los datos de entrada.

---

# 🧠 `recommendation_rules.py`

Contiene las **7 reglas de negocio** utilizadas para generar recomendaciones.

Cada regla analiza una situación financiera específica.

---

## 1. Regla de ahorro

Se activa dependiendo de la tasa de ahorro:

```text
< 10%     → alerta de ahorro
10%-20%   → situación intermedia
≥ 20%     → oportunidad para inversión
```

Ejemplo:

> "Tu nivel de ahorro actual es bajo respecto a tus ingresos. Establece una meta de ahorro mensual y automatiza una parte de tus ingresos."

---

## 2. Regla de endeudamiento

Se activa cuando:

```text
relacion_deuda_ingreso > 40%
```

Permite identificar situaciones donde una proporción elevada de los ingresos está comprometida con deuda.

Ejemplo:

> "Tu nivel de endeudamiento representa una proporción elevada de tus ingresos. Prioriza la reducción de las obligaciones con mayor costo."

---

## 3. Regla de fondo de emergencia

Analiza los meses de reserva disponibles.

```text
0 meses
< 1.5 meses
< 3 meses
< 6 meses
≥ 6 meses
```

La recomendación cambia dependiendo del nivel de protección financiera del usuario.

---

## 4. Regla de flujo de caja

Analiza si existe capacidad real de ahorro.

Se activa cuando:

```text
ahorro_real ≤ 0
```

o cuando:

```text
ahorro_real > 0
pero representa menos del 10% del ingreso
```

Esta regla permite detectar usuarios cuyos ingresos prácticamente se consumen en gastos y obligaciones.

---

## 5. Regla de suscripciones

Analiza el peso de las suscripciones sobre el ingreso.

Se activa cuando:

```text
ratio_suscripciones > 3%
```

o cuando existe un monto declarado de suscripciones.

La recomendación busca identificar servicios recurrentes que podrían estar afectando la capacidad de ahorro.

---

## 6. Regla de perfil financiero

Genera recomendaciones generales de acuerdo con las diferentes categorías del perfil:

```text
Crítico
En riesgo
En observación
Estable
Saludable
Excelente
```

Cada perfil puede tener diferentes recomendaciones y mensajes.

---

## 7. Regla de confianza del modelo

Permite advertir al usuario cuando la predicción tiene una probabilidad baja.

Se activa cuando:

```text
probabilidad < 60%
```

En este escenario se recomienda revisar los datos utilizados para generar el perfil.

Esto agrega una capa de **transparencia y explicabilidad** al sistema.

---

# ⭐ Priorización de recomendaciones

Una de las funciones principales del motor es evitar entregar una lista desordenada de recomendaciones.

Cada recomendación contiene:

```text
categoría
prioridad
título
explicación
acción
impacto
score
fecha
```

Las recomendaciones se ordenan utilizando:

```text
1. Prioridad
2. Score
```

Donde:

```text
0 = máxima prioridad
```

En caso de empate, se utiliza el `score` de manera descendente.

De esta forma, el usuario recibe primero las acciones que requieren mayor atención.

---

# 🧩 `recommendation_models.py`

Define el modelo de datos utilizado para representar una recomendación.

Se utiliza un `dataclass`:

```text
Recommendation
```

Esto permite mantener una estructura consistente entre las diferentes reglas.

Una recomendación puede contener:

```text
categoría
prioridad
título
explicación
acción
impacto
score
fecha
```

---

# ⚙️ `recommendation_engine.py`

Es el **núcleo del sistema de recomendaciones**.

Su responsabilidad es:

1. Recibir los datos financieros.
2. Ejecutar las reglas.
3. Recopilar las recomendaciones.
4. Eliminar inconsistencias.
5. Ordenar las recomendaciones.
6. Entregar el resultado al siguiente componente.

Conceptualmente:

```text
Input financiero
       │
       ▼
Regla de ahorro
Regla de deuda
Regla de emergencia
Regla de flujo de caja
Regla de suscripciones
Regla de perfil
Regla de confianza
       │
       ▼
Lista de recomendaciones
       │
       ▼
Priorización
       │
       ▼
Resultado final
```

---

# 🔗 `recommendation_service.py`

Funciona como punto de entrada de alto nivel.

Recibe:

```text
Perfil financiero
Probabilidad
Datos financieros
```

y coordina el proceso completo hasta producir el resultado final.

Esto permite mantener separada la lógica de negocio de la lógica de integración.

---

# 📦 `recommendation_serializer.py`

Convierte los objetos `Recommendation` en estructuras compatibles con JSON.

Esto permite que las recomendaciones puedan ser utilizadas posteriormente por:

* FastAPI.
* Frontend web.
* Aplicaciones móviles.
* Dashboards.
* Otros servicios backend.

---

# 🌐 API REST

El módulo está preparado para exponerse mediante una API REST.

## Endpoint

```http
POST /analizar-perfil
```

La ruta conecta:

```text
Datos financieros
        +
Transacciones
        │
        ▼
Machine Learning
        │
        ▼
Perfil financiero
        │
        ▼
Recommendation Engine
        │
        ▼
JSON
```

> `api_router.py` define un `APIRouter`, no una aplicación FastAPI completa. Debe montarse en la aplicación principal mediante `app.include_router(router)`.

---

# 📥 Entrada

Ejemplo de `AnalisisInputDTO`:

```json
{
  "ingreso_mensual": 3200,
  "nivel_endeudamiento": 0.35,
  "frecuencia_ahorro": "Mensual",
  "monto_inversion": 200,
  "deuda_total": 1100,
  "objetivo_presupuesto": 600,
  "pago_mensual_deuda": 150,
  "servicios_suscripción": 3,
  "fondo_emergencia": 1000,
  "transacciones": [
    {
      "descripcion": "Sueldo mensual recibido",
      "valor": 3200
    },
    {
      "descripcion": "Mercado",
      "valor": 500
    }
  ]
}
```

---

# 📤 Salida

Ejemplo de `RespuestaPythonDTO`:

```json
{
  "probabilidad_categoria": 0.91,
  "probabilidad_perfil_financiero": 0.78,
  "probabilidad_recomendaciones": 0.62,
  "perfil_financiero": "En observación",
  "resumen_gastos": {
    "Alimentación": 500.0
  },
  "recomendaciones": [
    "Monitoreo activo de hábitos de consumo: Lleva un registro diario de cada pequeño gasto durante las siguientes dos semanas para identificar patrones."
  ]
}
```

---

# 🧪 Testing

El módulo incluye pruebas automatizadas mediante **Pytest**.

### `test_financial_data_adapter.py`

Verifica:

* `meses_reserva`.
* `ratio_suscripciones`.
* `ahorro_real`.
* Adaptación de los datos.

### `test_recommendation_engine.py`

Verifica:

* Ejecución del motor.
* Generación de recomendaciones.
* Funcionamiento de las reglas principales.

### `conftest.py`

Configura la raíz del proyecto para permitir que los imports funcionen correctamente al ejecutar las pruebas.

---

# 🚀 Instalación

## 1. Crear entorno virtual

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

---

## 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

Dependencias principales:

```text
pandas
numpy
scikit-learn
joblib
jupyter
pytest
```

Para ejecutar la API:

```bash
pip install fastapi "uvicorn[standard]"
```

---

# ▶️ Ejecución

## Ejecutar demostración

```bash
python main.py
```

## Ejecutar pruebas

```bash
pytest -v
```

---

# 🔮 Evolución del proyecto

La arquitectura permite evolucionar el motor hacia un sistema de recomendaciones cada vez más inteligente.

### Próximas mejoras

* Integración completa mediante FastAPI.
* Dockerización del servicio.
* Persistencia de recomendaciones.
* Historial financiero del usuario.
* Sistema de feedback.
* Personalización basada en comportamiento.
* Nuevas reglas financieras.
* Optimización automática de prioridades.
* Sistema híbrido de Machine Learning + reglas.
* Explicaciones más personalizadas.
* Evaluación continua de la efectividad de las recomendaciones.

---

# 🏆 Valor técnico del módulo

El principal aporte de este componente es crear una **capa de decisión entre los modelos de Machine Learning y el usuario final**.

La arquitectura permite separar claramente:

```text
Machine Learning
      │
      │ "¿Cómo está el usuario?"
      ▼
Perfil financiero
      │
      ▼
Motor de recomendaciones
      │
      │ "¿Qué debería hacer?"
      ▼
Recomendación
      │
      ▼
Acción concreta
```

Esto permite que los modelos predictivos no sean el punto final del sistema.

El valor está en transformar una predicción en una **acción financiera comprensible y útil para el usuario**.

---

# 🧠 Principios aplicados

### Modularidad

Cada componente tiene una responsabilidad específica.

### Separación de responsabilidades

El Machine Learning, la adaptación de datos, las reglas y la API están desacoplados.

### Escalabilidad

Es posible agregar nuevas reglas sin modificar completamente el motor.

### Testeabilidad

Los componentes principales cuentan con pruebas automatizadas.

### Explicabilidad

Las recomendaciones incluyen una explicación y una acción concreta.

### Integrabilidad

La salida estructurada permite conectar el motor con una API REST y diferentes interfaces.

---

# 👨‍💻 Mauricio Medina

**Data & Backend — Recommendation Engine**

Desarrollo del motor encargado de convertir resultados de Machine Learning e indicadores financieros en recomendaciones personalizadas, explicables y priorizadas.

### Aporte principal

```text
Datos financieros
        ↓
Validación
        ↓
Reglas de negocio
        ↓
Priorización
        ↓
Recomendaciones
        ↓
API REST
```

> **"El Machine Learning identifica la situación financiera. Mi componente transforma esa información en una decisión accionable para el usuario."**

---

## 📌 Proyecto

**Financiera Saludable**

Hackathon ONE G9 LATAM
Alura + Oracle

**Tecnologías principales:**

`Python` · `Machine Learning` · `Pandas` · `NumPy` · `Scikit-learn` · `FastAPI` · `Pydantic` · `Pytest` · `Git`
