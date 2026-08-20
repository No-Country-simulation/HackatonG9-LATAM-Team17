# 🧠 Sistema Integral de Análisis y Recomendaciones Financieras

### Hackathon ONE – G9 | Alura + Oracle

> **Sistema end-to-end de clasificación de transacciones bancarias, predicción de perfil financiero y generación de recomendaciones personalizadas mediante Machine Learning y reglas de negocio.**

---

## 🎯 Visión General

Este proyecto integra tres grandes módulos desarrollados en equipo para el Hackathon ONE, cada uno con responsabilidad clara y bien delimitada:

| Módulo | Responsable | Función |
|--------|-------------|---------|
| **Clasificador NLP de transacciones** | **José** | NLP con TF-IDF + señales léxicas + regresión logística con política de confianza |
| **Ciencia de Datos (perfil financiero)** | **Natalia** | Ingeniería de características, clasificación del tipo de ingreso y modelo de perfil financiero |
| **Recommendation Engine + API** | **Mauricio** | Motor de reglas de negocio, flexibilización de perfil, adaptador de datos y endpoint FastAPI |

El resultado final es una **API REST** que recibe datos financieros crudos (transacciones + variables del usuario) y devuelve un análisis completo: resumen de gastos por categoría, perfil financiero con probabilidades y recomendaciones priorizadas y accionables.

---

## 🏗️ Arquitectura End-to-End

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API REST (FastAPI)                           │
│                   POST /analizar-perfil                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     ORQUESTADOR (financial_processor)                │
│                                                                     │
│  1. Clasifica transacciones  ──►  2. Predice perfil financiero      │
│  3. Flexibiliza el perfil    ──►  4. Ejecuta motor de reglas        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  CLASIFICADOR │    │  MODELO PERFIL   │    │  RECOMMENDATION  │
│   ML (NLP)    │    │    FINANCIERO    │    │     ENGINE       │
│  TF-IDF + LR  │    │   (joblib .pkl)  │    │   (7 reglas)     │
│   [José]      │    │   [Natalia]      │    │   [Mauricio]     │
└───────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 📂 Estructura del Proyecto

```
proyecto/
│
├── clasificador/                      # 🧠 Módulo NLP (José)
│   ├── __init__.py                    # API pública del paquete
│   ├── modelo.py                      # ClasificadorGastos + serialización segura
│   ├── datos.py                       # Dominio, señales léxicas, aumento de datos
│   ├── texto.py                       # Normalización y tokens informativos
│   └── contrato_json.py               # Adaptador JSON ↔ clasificador
│
├── ciencia_datos/                     # 📊 Módulo Ciencia de Datos (Natalia)
│   ├── generar_caracteristicas.py     # Ingeniería de 17 variables financieras
│   ├── clasificar_tipo_ingreso.py     # Identificación del tipo de ingreso
│   └── notebooks/                     # Notebooks de entrenamiento
│
├── recomendaciones/                   # 💡 Motor de recomendaciones (Mauricio)
│   ├── recommendation_engine.py       # Orquestador de 7 reglas
│   ├── recommendation_rules.py        # Reglas de negocio (ahorro, deuda, etc.)
│   ├── recommendation_models.py       # Dataclass Recommendation
│   ├── recommendation_serializer.py   # Serialización a JSON
│   ├── recommendation_service.py      # Servicio de integración
│   ├── financial_data_adapter.py      # Adaptador de variables financieras
│   ├── profile_flexibility.py         # Flexibilización del perfil
│   ├── financial_processor.py         # Procesador ML + perfil
│   ├── json_loader.py                 # Carga de datos JSON
│   └── __init__.py                    # API pública del paquete
│
├── api/                               # 📡 Capa de exposición (Mauricio)
│   ├── api_router.py                  # Endpoint FastAPI
│   └── schemas.py                     # DTOs Pydantic
│
└── modelos/                           # 📦 Artefactos entrenados (.pkl)
    ├── clasificador_gastos.pkl        # NLP clasificador (José)
    ├── clasificador_gastos.pkl.sha256 # Checksum SHA-256
    ├── modelo_perfil_financiero.pkl   # Perfil financiero (Natalia)
    ├── modelo_tipo_ingreso_1.pkl      # Tipo de ingreso v1 (Natalia)
    └── modelo_tipo_ingreso_2.pkl      # Tipo de ingreso v2 (Natalia)
```

---

## 🔄 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ENTRADA: Transacciones + Datos Financieros del Usuario       │
│    (ingreso, deuda, ahorro, inversiones, suscripciones, etc.)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CLASIFICADOR NLP (José)                                      │
│    • Normaliza texto (tildes, mayúsculas, puntuación)           │
│    • Extrae features: palabras + caracteres + señales léxicas   │
│    • Regresión logística multiclase con temperature scaling     │
│    • Política de confianza (umbral, margen, cobertura)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. INGENIERÍA DE CARACTERÍSTICAS (Natalia)                      │
│    • 17 variables financieras derivadas                         │
│    • Tipo de ingreso, estrés financiero, flujo de caja          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. MODELO DE PERFIL FINANCIERO (Natalia)                        │
│    • Predice: Excelente / Saludable / Estable / En observación  │
│              / En riesgo / Crítico                              │
│    • Devuelve probabilidades por clase                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. FLEXIBILIZACIÓN DEL PERFIL (Mauricio)                        │
│    Ajusta la etiqueta según indicadores críticos                │
│    (deuda > 50%, reserva < 1 mes, tasa de ahorro ≥ 20%)         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. RECOMMENDATION ENGINE (Mauricio) — 7 reglas de negocio       │
│    ① Ahorro    ② Endeudamiento    ③ Fondo de emergencia         │
│    ④ Flujo de caja    ⑤ Suscripciones                           │
│    ⑥ Perfil financiero    ⑦ Confianza del modelo                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. SALIDA JSON                                                  │
│    { probabilidad_categoria, probabilidad_perfil,               │
│      probabilidad_recomendaciones, perfil_financiero,           │
│      resumen_gastos, recomendaciones }                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Módulo 1 — Clasificador NLP (José)

### Arquitectura del modelo

```
┌─────────────────────────────────────────────────────────┐
│              FeatureUnion (3 transformadores)            │
├─────────────────────────────────────────────────────────┤
│  TF-IDF palabras (1-2 gramos)        peso: 1.0          │
│  TF-IDF caracteres (3-5 gramos)      peso: 0.8          │
│  Señales léxicas financieras         peso: 2.5          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  LogisticRegression multiclase (C=3.0, balanced)        │
│  + Temperature Scaling (calibración de probabilidades)  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Política de confianza (post-procesamiento)             │
│  • Umbral mínimo: 55%                                   │
│  • Margen mínimo: 8%                                    │
│  • Cobertura léxica mínima: 20%                         │
│  • Respaldo: "Otros" si falla alguna condición          │
└─────────────────────────────────────────────────────────┘
```

### Categorías financieras (12)

| Categoría | Ejemplos |
|-----------|----------|
| **Alimentación** | supermercado, restaurante, abarrotes, pollería |
| **Aporte Inversiones** | acciones, ETF, AFP, broker, cripto |
| **Educación** | universidad, curso, matrícula, colegio |
| **Gastos Hormiga** | café, snack, golosina, kiosco |
| **Ingresos** | sueldo, salario, honorarios, bonificación |
| **Ocio** | cine, concierto, videojuego, teatro |
| **Otros** | retiro, ropa, desconocido, impuesto |
| **Salud** | farmacia, clínica, dentista, vacuna |
| **Servicios** | electricidad, internet, agua, telefonía |
| **Suscripciones** | Netflix, Spotify, streaming, membresía |
| **Transporte** | Uber, taxi, gasolina, peaje, metro |
| **Vivienda** | alquiler, hipoteca, condominio, plomero |

### Seguridad del artefacto

- ✅ Serialización atómica con archivo temporal
- ✅ Checksum SHA-256 lateral (`.pkl.sha256`)
- ✅ Verificación con `hmac.compare_digest` (timing-safe)
- ✅ Validación de versión mayor del artefacto
- ✅ Detección de incompatibilidad de scikit-learn
- ✅ `fsync` para garantizar persistencia en disco
- ✅ Validación anti-fuga entre splits de entrenamiento/evaluación

---

## 📊 Módulo 2 — Ciencia de Datos (Natalia)

### Flujo de Ciencia de Datos

```
Información financiera del usuario
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
       Modelo de Machine Learning
              │
       ┌──────┴──────┐
       ▼             ▼
Perfil financiero   Probabilidad
```

### Variables financieras generadas (17)

```
ingreso_mensual              gasto_mensual_total
tasa_ahorro                  objetivo_presupuesto
relacion_deuda_ingreso       pago_prestamo
monto_inversion              servicios_suscripcion
fondo_emergencia             cantidad_transacciones
gastos_discrecionales        gastos_esenciales
tipo_ingreso                 alquiler_o_hipoteca
estado_flujo_caja            nivel_estres_financiero
ahorro_real
```

### Fórmulas clave

```
ahorro_real = ingreso_mensual - gasto_mensual_total + aporte_inversiones

tasa_ahorro = ahorro_real / ingreso_mensual

relacion_deuda_ingreso = deuda_total / ingreso_mensual

meses_reserva = fondo_emergencia / gasto_mensual_esencial
```

### Clasificación del tipo de ingreso

```
Salario | Independiente | Mixto | Sin ingreso
```

### Nivel de estrés financiero

```
Bajo | Medio | Alto
```

### Modelos entrenados

```
modelos/
├── modelo_perfil_financiero.pkl   # Clasificador del perfil financiero
├── modelo_tipo_ingreso_1.pkl      # Tipo de ingreso (v1)
└── modelo_tipo_ingreso_2.pkl      # Tipo de ingreso (v2)
```

---

## 💡 Módulo 3 — Recommendation Engine (Mauricio)

### Motor de reglas de negocio (7 reglas)

| # | Regla | Prioridad | Impacto |
|---|-------|-----------|---------|
| 1 | **Ahorro** | 2-3 | Medio/Bajo |
| 2 | **Endeudamiento** | 1-3 | Alto/Bajo |
| 3 | **Fondo de emergencia** | 1-4 | Alto/Bajo |
| 4 | **Flujo de caja** | 1-2 | Alto/Medio |
| 5 | **Suscripciones** | 3 | Bajo |
| 6 | **Perfil financiero** | 0-4 | Alto/Bajo |
| 7 | **Confianza del modelo** | 4 | Informativo |

Cada recomendación incluye:
- **Categoría** (ej. "Ahorro")
- **Prioridad** (0 = más urgente)
- **Título** descriptivo
- **Explicación** con datos del usuario
- **Acción** concreta (variedad aleatoria para evitar monotonía)
- **Impacto** (Alto / Medio / Bajo / Informativo)
- **Score** (0.0 - 1.0, desempate)
- **Fecha** de generación

### Adaptador de datos

El módulo `financial_data_adapter.py` cierra la brecha entre los nombres de variables del modelo de Natalia y los nombres esperados por las reglas de negocio. Calcula variables derivadas:

- `meses_reserva`: cuántos meses de gastos esenciales cubre el fondo de emergencia
- `ratio_suscripciones`: peso de las suscripciones sobre el ingreso mensual

### Flexibilización del perfil

La capa `profile_flexibility.py` ajusta la etiqueta del ML según indicadores críticos:

- Si `probabilidad < 0.55` y `deuda > 50%` → **Crítico**
- Si `tasa_ahorro ≥ 25%` y `reserva ≥ 6 meses` → **Excelente**

---

## 📡 Módulo 4 — API REST (FastAPI)

### Endpoint principal

```http
POST /analizar-perfil
Content-Type: application/json
```

### Request (DTO de entrada)

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
    { "descripcion": "PAGO SUPERMERCADO METRO", "valor": -150.50 },
    { "descripcion": "UBER VIAJE CENTRO", "valor": -25.00 },
    { "descripcion": "NETFLIX MENSUAL", "valor": -15.99 }
  ]
}
```

### Response (DTO de salida)

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

## 🚀 Uso

### 1. Cargar el clasificador

```python
from clasificador.modelo import cargar_modelo

modelo = cargar_modelo("modelos/clasificador_gastos.pkl", verificar_integridad=True)
resultado = modelo.predecir("PAGO SUPERMERCADO METRO")
print(resultado["categoria"])            # "Alimentación"
print(resultado["confianza_porcentaje"]) # 92.3
```

### 2. Clasificar un payload JSON

```python
from clasificador.contrato_json import clasificar_payload

payload = {
    "transacciones": [
        {"descripcion": "UBER VIAJE", "valor": -25.0, "fecha": "2026-08-19T09:00:00Z"},
        {"descripcion": "NETFLIX MENSUAL", "valor": -15.99, "fecha": "2026-08-19T00:00:00Z"}
    ]
}
resultado = clasificar_payload(payload, modelo)
```

### 3. Entrenar el clasificador

```python
from clasificador.modelo import ClasificadorGastos
from clasificador.datos import cargar_datos_entrenamiento_ampliado

datos = cargar_datos_entrenamiento_ampliado("transacciones.csv", objetivo_total=100_000)

clasificador = ClasificadorGastos(
    umbral_confianza=0.55,
    margen_minimo=0.08,
    cobertura_minima=0.20,
    c_regularizacion=3.0
)
clasificador.entrenar(datos["descripcion"], datos["categoria"])
clasificador.guardar("modelos/clasificador_gastos.pkl")
```

### 4. Ejecutar el motor de recomendaciones

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

recomendaciones = engine.generate("Estable", financial_data, probability=0.76)
for r in recomendaciones:
    print(f"[{r.prioridad}] {r.titulo}: {r.accion}")
```

### 5. Levantar la API

```bash
uvicorn api.api_router:router --host 0.0.0.0 --port 8000
```

---

## 🛡️ Protecciones Implementadas

### Clasificador (José)
- ✅ Validación anti-fuga entre splits
- ✅ Detección de descripciones contradictorias
- ✅ Prevención de duplicados
- ✅ Checksum SHA-256 con comparación segura
- ✅ Política de confianza multi-criterio

### Ciencia de Datos (Natalia)
- ✅ Aumento de datos sintético determinista y reproducible
- ✅ Grupos trazables para validación cruzada sin fuga semántica
- ✅ Validación estricta de columnas y categorías

### Recommendation Engine (Mauricio)
- ✅ Adaptador de variables que cierra brechas de nomenclatura
- ✅ Alias de compatibilidad hacia atrás
- ✅ Cálculo defensivo de variables derivadas
- ✅ Ordenamiento determinista por prioridad y score
- ✅ Flexibilización dinámica del perfil según indicadores críticos

---

## 🧰 Tecnologías

```
Python 3.11+
FastAPI + Pydantic
scikit-learn 1.3+
NumPy + SciPy
Pandas
Joblib
Unicodedata (NFKD normalization)
Jupyter Notebook (entrenamiento)
```

---

## 📦 Artefactos Entrenados (`.pkl`)

Los modelos serializados corresponden únicamente a los módulos de **Machine Learning** (clasificador NLP y perfil financiero). El **Recommendation Engine** no genera artefactos `.pkl` porque es un sistema basado en **reglas de negocio programadas** (no en modelos entrenados).

| Archivo | Contenido | Autor |
|---------|-----------|-------|
| `clasificador_gastos.pkl` | Pipeline TF-IDF + LogisticRegression + calibración | José |
| `clasificador_gastos.pkl.sha256` | Checksum de integridad | José |
| `modelo_perfil_financiero.pkl` | Clasificador del perfil financiero | Natalia |
| `modelo_tipo_ingreso_1.pkl` | Clasificador de tipo de ingreso (v1) | Natalia |
| `modelo_tipo_ingreso_2.pkl` | Clasificador de tipo de ingreso (v2) | Natalia |

> 💡 **Nota:** El motor de recomendaciones (Mauricio) no requiere entrenamiento ni artefactos `.pkl`. Su inteligencia reside en **7 reglas de negocio** implementadas en Python puro (`recommendation_rules.py`), que evalúan indicadores financieros y generan recomendaciones priorizadas de forma determinista.

---

## 🏆 Aporte del Proyecto

> **Transformamos datos financieros dispersos (transacciones, deudas, ahorros, inversiones) en un diagnóstico estructurado del comportamiento económico del usuario, y generamos recomendaciones financieras personalizadas, priorizadas y accionables.**

```
DATOS FINANCIEROS
       ↓
CLASIFICACIÓN NLP (José)
       ↓
INGENIERÍA DE CARACTERÍSTICAS (Natalia) — 17 variables
       ↓
MACHINE LEARNING (Natalia) — Perfil financiero
       ↓
FLEXIBILIZACIÓN DE PERFIL (Mauricio)
       ↓
MOTOR DE RECOMENDACIONES (Mauricio) — 7 reglas
       ↓
RECOMENDACIONES ACCIONABLES
```

---

## 👥 Equipo

| Integrante | Rol | Módulo |
|------------|-----|--------|
| **José** | ML Engineer | Clasificador NLP de transacciones (TF-IDF + señales léxicas + regresión logística + política de confianza + serialización segura) |
| **Natalia** | Data Scientist | Ciencia de Datos: ingeniería de características, clasificación del tipo de ingreso, modelo de perfil financiero |
| **Mauricio** | Backend / ML Ops | Recommendation Engine, flexibilización de perfil, adaptador de datos, API FastAPI |

---

## 📄 Licencia

Proyecto desarrollado para el **Hackathon ONE – Grupo 9 | Alura + Oracle**.  
Todos los derechos reservados.
