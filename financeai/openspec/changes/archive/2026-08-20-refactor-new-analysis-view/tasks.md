## 1. Limpieza de estados y detección de información base

- [x] 1.1 Modificar en `src/components/NewAnalysisView.tsx` los `useState` de Información Base (`ingresoMensual`, `deudaTotal`, `frecuenciaAhorro`) para que inicialicen con valores de `userProfile` si existen, o con strings vacíos (y 'Mensual' para frecuencia).
- [x] 1.2 Modificar los `useState` de Indicadores Avanzados (`objetivoPresupuesto`, `pagoMensualDeuda`, `serviciosSuscripcion`, `fondoEmergencia`) para que inicialicen con valores de `userProfile` si existen, o con strings vacíos (sin mocks como '3000000').
- [x] 1.3 Eliminar el array de transacciones mockeadas del fallback de `handleCsvUpload` (líneas 147-152), reemplazándolo por una advertencia de error al usuario si el CSV es inválido.
- [x] 1.4 Agregar la constante `tieneInformacionBase` evaluando que `userProfile.ingresoMensual` y `userProfile.deudaTotal` sean mayores a 0.

## 2. Refactor UI de Información Financiera Base

- [x] 2.1 Aplicar el atributo `disabled={tieneInformacionBase}` (junto con clases CSS para opacidad `disabled:opacity-60`) a los inputs de `ingresoMensual`, `deudaTotal` y `frecuenciaAhorro`.
- [x] 2.2 Agregar un bloque de renderizado condicional debajo o dentro de la "Información Financiera Base" que, si `tieneInformacionBase` es `true`, muestre un botón "Actualizar Información Financiera" (con estilo outline).
- [x] 2.3 Conectar dicho botón a la lógica de navegación (usando props pasadas desde `App.tsx` o un método global) para cambiar la vista a `SettingsProfileView.tsx`.

## 3. Validación y Ajuste Final del Formulario

- [x] 3.1 Agregar los atributos `required` a los campos de Indicadores Financieros Avanzados que alimentan el payload de análisis.
- [x] 3.2 Modificar `manejarGenerarAnalisis` para asegurar que parseFloat use fallback de 0 de forma segura si el campo estuviera vacío, aunque los forms no deberían permitirse enviar vacíos gracias al requerimiento nativo de HTML5.
