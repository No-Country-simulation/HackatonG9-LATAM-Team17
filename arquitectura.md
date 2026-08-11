# Motor Inteligente de Recomendaciones Financieras

## Objetivo

Desarrollar un motor de recomendaciones financieras personalizadas capaz de analizar el perfil financiero generado por el modelo de Machine Learning y transformar esa información en acciones concretas que ayuden al usuario a mejorar su salud financiera.

---

## Responsabilidad del módulo

Este módulo NO realiza la clasificación del perfil financiero.

Su responsabilidad consiste en:

- Adaptar las variables financieras que entrega el pipeline de Ciencia de Datos al contrato interno del motor (`FinancialDataMapper`).
- Analizar el perfil financiero generado por el modelo de Machine Learning.
- Evaluar las variables financieras del usuario.
- Aplicar reglas de negocio.
- Priorizar las recomendaciones.
- Explicar el motivo de cada recomendación.
- Devolver una respuesta estructurada en formato JSON.

Este módulo tampoco calcula el `resumen_gastos` por categoría que aparece en el ejemplo de salida del hackathon: ese resumen proviene del clasificador de transacciones (Natalia) y debe combinarse con la salida de este motor en la capa de API/backend, no dentro del `RecommendationEngine`.

---

## Arquitectura del módulo

```text
Datos del usuario (transacciones + variables financieras)
        │
        ▼
Modelo de Perfil Financiero (Natalia)
  - modelo_tipo_ingreso_1.pkl / _2.pkl
  - perfil_financiero.pkl
        │
        ▼
Perfil Financiero + Variables financieras (datos2)
        │
        ▼
FinancialDataMapper
  - Normaliza nombres de columna
  - Deriva variables que el motor necesita
    y el pipeline de datos no calcula
    (ej. meses_reserva)
        │
        ▼
Recommendation Engine (Mauricio)
        │
        ├── Analizador de variables (reglas por indicador)
        ├── Motor de reglas (perfil financiero, 6 clases)
        ├── Priorizador (prioridad + score)
        ├── Explicador
        ▼
Recomendaciones personalizadas (JSON)
```

---

## Contrato de entrada (`financial_data`)

El diccionario que recibe `RecommendationService.analyze()` en `financial_data`
debe seguir el mismo esquema de columnas que produce
`generar_caracteristicas_usuario()` en el notebook de Natalia:

```
ingreso_mensual, gasto_mensual_total, tasa_ahorro, objetivo_presupuesto,
relacion_deuda_ingreso, pago_prestamo, monto_inversion,
servicios_suscripcion, fondo_emergencia, cantidad_transacciones,
gastos_discrecionales, gastos_esenciales, tipo_ingreso,
alquiler_o_hipoteca, estado_flujo_caja, nivel_estres_financiero,
ahorro_real
```

Notas sobre escalas (verificadas contra `df_modelo_pf.csv`):

- `tasa_ahorro` y `relacion_deuda_ingreso` son proporciones (0.0 - 1.0), no porcentajes.
- `servicios_suscripcion` es un conteo de suscripciones activas (rango observado: 1-9), no un monto en dinero.
- El resto de variables monetarias están en la misma unidad de `ingreso_mensual`.

`FinancialDataMapper` toma este diccionario y agrega la variable derivada
`meses_reserva = fondo_emergencia / gastos_esenciales`, que las reglas de
fondo de emergencia usan para decidir si el colchón del usuario es
suficiente.

---

## Flujo del sistema

1. El usuario envía sus datos financieros y transacciones.
2. El pipeline de Natalia clasifica las transacciones, calcula las variables agregadas (`datos2`) y predice el perfil financiero junto con su probabilidad.
3. `FinancialDataMapper` normaliza y enriquece esas variables.
4. El Recommendation Engine analiza las variables financieras y aplica las reglas de negocio (una por indicador, más una regla dedicada al perfil financiero y otra a la confianza del modelo).
5. Se priorizan las recomendaciones (por `prioridad` y, en caso de empate, por `score`).
6. Se generan explicaciones para cada recomendación.
7. Se devuelve un JSON listo para ser consumido por la API REST, incluyendo `impacto` y `score` de cada recomendación.
