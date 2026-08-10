# Model card y explicación técnica

## 1. Problema que resuelve

El componente recibe una descripción corta —por ejemplo `renovacion mensual de
Netflix`— y elige una de 12 categorías conocidas. Como durante el entrenamiento
sí existen etiquetas correctas, es un problema de **clasificación supervisada
multiclase**.

No es regresión lineal: no se predice un número continuo. Tampoco es clustering:
las categorías ya están definidas por el negocio. No es aprendizaje por refuerzo:
no hay un agente que tome acciones sucesivas y reciba recompensas.

## 2. Por qué se eligió regresión logística

Se evaluaron modelos que aceptan matrices dispersas de texto. La métrica principal
fue F1 macro, porque concede el mismo peso a cada categoría aunque cambie su
frecuencia.

| Familia | Ventaja | Resultado / decisión |
|---|---|---|
| SVM lineal | Muy buena en alta dimensión | F1 75.03%; solo 0.16 puntos sobre logística y requiere calibrador adicional |
| Regresión logística | Probabilidades nativas, interpretable y compacta | F1 74.87%; elegida |
| SGD logístico | Entrenamiento incremental rápido | F1 74.47%; no mejoró al modelo elegido |
| Naive Bayes complementario | Baseline rápido para texto | F1 73.22% |
| Bosque aleatorio | Captura relaciones no lineales | F1 68.29%; los cortes de árboles se adaptan peor al gran espacio TF-IDF |

KNN no se llevó al artefacto porque almacenar 100,000 vecinos encarece inferencia
y distancia en alta dimensión. Un SVM con kernel RBF tampoco es apropiado para
esa escala; la comparación usa su variante lineal. PCA/K-Means puede servir para
exploración, pero no reemplaza el clasificador etiquetado. XGBoost y Random Forest
son excelentes candidatos para variables tabulares, no necesariamente para
decenas de miles de n-gramas dispersos.

La regla previa al holdout fue conservar regresión logística cuando quedara a
menos de un punto de F1 del mejor modelo. La diferencia observada está dentro de
la variabilidad entre folds, mientras que logística ofrece directamente
`predict_proba` y deja un PKL de aproximadamente 2 MB.

## 3. Cómo se construyen los 100,000 casos

La fuente manual `datos/entrenamiento.csv` contiene 118 casos revisados. El código
mantiene un vocabulario de conceptos por categoría y combina cada concepto con
formas neutrales que suelen aparecer en estados de cuenta, como `cargo bancario
por`, `trx tarjeta`, `desde banca movil` o `comprobante electronico`.

`cargar_datos_entrenamiento_ampliado(..., objetivo_total=100_000)`:

1. valida textos y categorías manuales;
2. calcula una cuota balanceada por categoría;
3. genera combinaciones deterministas y sin duplicados;
4. conserva el grupo del concepto original;
5. verifica contradicciones y exige exactamente 100,000 textos únicos.

Distribución final: las primeras cuatro categorías tienen 8,334 casos y las
restantes 8,333. El hash del dataset se guarda dentro del PKL. No se versiona un
archivo gigante porque la misma base puede reconstruirse desde el código.

La cifra debe comunicarse con honestidad: son **100,000 muestras de
entrenamiento**, pero solo 118 son redacciones manuales. La aumentación enseña
invariancia frente al formato bancario; no inventa comercios, regionalismos ni
patrones reales nuevos.

## 4. Cómo el texto se convierte en una predicción

### Normalización

`normalizar_texto` convierte a minúsculas, elimina acentos y puntuación, conserva
dígitos y compacta espacios. Así, `PAGO Clínico #2026` se convierte en
`pago clinico 2026`.

### TF-IDF de palabras

Se aprenden unigramas y bigramas. TF-IDF aumenta el peso de expresiones útiles
como `fondo mutuo` o `pago netflix` y reduce el de palabras frecuentes que aportan
poca distinción.

### TF-IDF de caracteres

Se aprenden fragmentos de 3 a 5 caracteres. Esto permite reconocer similitud en
abreviaturas y errores como `netflx`, donde las palabras exactas fallarían.

### Señales léxicas

Un transformador pequeño cuenta términos financieros conservadores por categoría.
Esas señales entran como columnas del vector y sus pesos los aprende la regresión;
no sustituyen la predicción mediante reglas `if/else`.

### Regresión logística multiclase

La regresión aprende un vector de pesos por categoría. Para un texto nuevo calcula
12 puntuaciones y las transforma con softmax en probabilidades que suman 1. La
categoría con mayor probabilidad se devuelve al backend.

### Calibración y rechazo interno

Una partición independiente de 94 casos elige la temperatura que minimiza
`log-loss`; el valor final fue 1.0, señal de que la probabilidad nativa no necesitó
ser afinada. Esa misma partición eligió un umbral interno de 0.35 con objetivo de
93% de precisión entre casos aceptados.

El contrato del backend siempre recibe la mejor categoría y su `confiabilidad`.
La API interna conserva además margen, cobertura léxica, top 3 y motivo de rechazo
para auditoría, pero no añade esos campos a la respuesta acordada.

## 5. Separación y evaluación sin fuga

- Selección: 2,343 textos compactos, agrupados en 563 conceptos.
- Validación: 94 textos para temperatura y umbral.
- Holdout: 72 textos, seis por categoría, usados únicamente al final.

`StratifiedGroupKFold` mantiene todas las variantes de un concepto en el mismo
fold. Por ejemplo, el modelo no puede entrenar con `pago por supermercado` y ser
evaluado con `cargo de supermercado`. Esta prueba produce un F1 cercano a 75%,
mucho más honesto para conceptos nuevos que una división aleatoria de frases
sintéticas.

El holdout final alcanzó:

| Métrica | Valor |
|---|---:|
| Exactitud | 0.9583 |
| F1 macro | 0.9582 |
| Log-loss | 0.1848 |
| Brier multiclase | 0.0533 |
| ECE top | 0.0262 |
| Cobertura automática | 0.9861 |
| Precisión entre aceptadas | 0.9718 |

El holdout es pequeño, por lo que estos valores son evidencia inicial, no una
garantía de producción. El resultado conservador que debe citarse para
generalización a conceptos desconocidos es también la validación agrupada.

## 6. Lectura guiada del código

Solo hay dos ejecutables principales:

### `entrenar.py`

- `comparar_familias_modelos`: prueba las cinco familias con los mismos folds.
- `seleccionar_regularizacion`: elige `C` para regresión logística.
- `seleccionar_temperatura`: calibra probabilidades sin tocar el holdout.
- `seleccionar_umbral`: ajusta la política de confianza.
- `evaluar_holdout`: calcula métricas y predicciones finales.
- `main`: conecta los pasos, llama a `.entrenar(...)` y guarda el PKL.

### `probar_modelo_json.py`

Lee `ejemplos/entrada_transacciones.json`, carga el PKL, ejecuta inferencia y
escribe `ejemplos/salida_transacciones.json`. Es el archivo de demostración para
el jurado.

Los módulos internos separan responsabilidades sin duplicar flujos:

- `clasificador/datos.py`: categorías, semillas, aumentación y controles de fuga.
- `clasificador/modelo.py`: TF-IDF, `.fit`, `.predict_proba`, calibración y Pickle.
- `clasificador/contrato_json.py`: valida entrada y limita la salida a dos campos.
- `clasificador/texto.py`: normalización común.

## 7. Contrato de variables

| Campo | Tipo | Uso |
|---|---|---|
| `descripcion` | texto no vacío | Única variable predictora |
| `valor` | número finito | Se valida; no entra al modelo |
| `fecha` | fecha ISO-8601 | Se valida; no entra al modelo |

Excluir el valor evita aprender límites monetarios frágiles entre países y
monedas. Excluir la fecha evita estacionalidad accidental. En particular,
`GASTOS_HORMIGA` se identifica por redacción de microcompra o impulso, no solo por
un monto bajo.

## 8. Archivos producidos

- `modelos/clasificador_gastos.pkl`: pipeline y metadatos entrenados.
- `modelos/clasificador_gastos.pkl.sha256`: verificación de integridad.
- `resultados/comparacion_modelos.json`: benchmark reproducible.
- `resultados/resumen_entrenamiento.json`: parámetros, curvas y hash de datos.
- `resultados/evaluacion_final.json`: métricas y matriz de confusión.
- `resultados/predicciones_holdout.json`: auditoría caso por caso.

No se generan respuestas CSV. Los CSV existentes son únicamente datos
etiquetados para entrenar, validar y evaluar.

## 9. Riesgos y siguiente mejora real

- Incorporar transacciones reales anonimizadas y corregidas por usuarios.
- Aumentar el holdout real por país, banco y categoría.
- Vigilar deriva de comercios, abreviaturas y nuevas suscripciones.
- Revisar especialmente confusiones `Alimentacion`/`Vivienda` y `Ocio`/`Otros`.
- Recalibrar periódicamente la confianza; una probabilidad no es una garantía.

Nunca se debe copiar el holdout al entrenamiento. Pickle solo debe cargarse desde
una fuente confiable, incluso cuando su checksum sea correcto.
