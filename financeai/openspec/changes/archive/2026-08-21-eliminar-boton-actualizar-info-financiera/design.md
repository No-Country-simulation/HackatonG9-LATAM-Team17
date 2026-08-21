## Context

Actualmente en `src/components/NewAnalysisView.tsx`, los campos de "Información Financiera Base" se encuentran bloqueados visualmente mediante la variable `tieneInformacionBase` que, al evaluarse como verdadera, deshabilita los inputs (`disabled={tieneInformacionBase}`) y muestra un botón de "Actualizar Información Financiera" que redirige al usuario a la vista de perfil. Debido a los recientes cambios arquitectónicos en la vista del perfil (donde la información financiera ahora es de solo lectura y no editable), este comportamiento en la vista de análisis ya no tiene sentido. Además, el endpoint `/api/v1/finanzas/analizar` espera recibir todos los parámetros financieros al generar un reporte, por lo que requerimos que estos campos sean siempre editables en este paso.

## Goals / Non-Goals

**Goals:**
- Hacer que los campos de "Ingreso Mensual Total", "Valor Total Deudas" y "Frecuencia de Ahorro" en `NewAnalysisView.tsx` sean permanentemente editables.
- Inicializar estos campos con los datos del perfil global (`userProfile`) provenientes del `OnboardingModal` u otros análisis previos para evitar la doble carga de datos.
- Eliminar el botón "Actualizar Información Financiera" en `NewAnalysisView.tsx` y su contenedor.
- Limpiar el código innecesario, como la variable y las comprobaciones asociadas a `tieneInformacionBase`.

**Non-Goals:**
- No se modificarán los endpoints del backend, todo sigue operando enviando los parámetros locales tal cual.
- No se modificarán otros componentes ajenos al flujo del nuevo análisis.

## Decisions

- **Eliminación de la dependencia `tieneInformacionBase`**: Se eliminará completamente del código la declaración `const tieneInformacionBase = true;` y de todos los lugares donde se use (como en `disabled={tieneInformacionBase}`).
- **Manejo de estado inalterado y precarga inteligente**: Los inputs están vinculados a variables de estado locales. En lugar de vaciar estos estados forzosamente al montar el componente, el hook `useEffect` los inicializará con la información disponible en `userProfile`. El usuario puede luego editarlos libremente y React sincronizará estos valores. El envío de información a través del `fetch` seguirá extrayendo el contenido de estos mismos estados sin modificaciones en el cuerpo del request.

## Risks / Trade-offs

- Ninguno. La eliminación de la restricción expone la capacidad de edición al usuario, mejorando el flujo. Los estados ya se inicializan con la información que el usuario ingresó en el onboarding, lo que evita fricción para generar el primer análisis.
