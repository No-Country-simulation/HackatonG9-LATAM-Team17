## Why

El componente `NewAnalysisView.tsx` actualmente intenta enviar datos al endpoint obsoleto `/api/analyze` con un formato que no coincide con las especificaciones del backend. Según `docs/API_BACKEND_ENDPOINTS.md`, el endpoint real es `POST /api/v1/finanzas/analizar`. Este endpoint espera parámetros específicos (`ingreso_mensual`, `nivel_endeudamiento`, etc.) y devuelve un reporte estructurado en la llave `datos_analisis`. Además, el componente contiene una gran cantidad de estados y funciones en inglés, violando la regla del proyecto de usar nomenclatura estrictamente en español.

## User Review Required

**⚠️ ADVERTENCIA: Cambio de Nomenclatura**
El código actual está casi totalmente en inglés en cuanto a sus variables de estado. Propongo traducirlos al español para cumplir la regla del proyecto:
- `monthlyIncome` -> `ingresoMensual`
- `totalDebts` -> `deudaTotal`
- `savingsFrequency` -> `frecuenciaAhorro`
- `budgetGoal` -> `objetivoPresupuesto`
- `monthlyDebtPayment` -> `pagoMensualDeuda`
- `subscriptionsCount` -> `serviciosSuscripcion`
- `emergencyFund` -> `fondoEmergencia`
- `transactionsList` -> `listaTransacciones`
- etc.
¿Estás de acuerdo con aplicar esta reescritura masiva de las variables del estado local?

- **Adición de UI:** Se agregará un nuevo campo "Monto de Inversión ($)" en la sección de "Indicadores Financieros Avanzados" para capturar el valor de `montoInversion` requerido por el backend. El diseño coincidirá exactamente con los campos existentes (como "Objetivo de Presupuesto").
- **Renombramiento:** Todas las variables de estado y funciones auxiliares serán traducidas al español usando `camelCase`.
- **Llamada a la API:** Se cambiará la ruta de la petición en `handleGenerateAnalysis` a `http://localhost:8080/api/v1/finanzas/analizar`.
- **Mapeo de Solicitud:** Se construirá el payload JSON extrayendo o calculando los valores a partir del estado de React (ahora incluyendo `monto_inversion` capturado por la UI y calculando `nivel_endeudamiento`).
- **Mapeo de Respuesta:** La respuesta del backend (`datos_analisis`) se traducirá al objeto de tipo `ReporteAnalisis` que espera la UI.
- **Diseño Conservado:** Se mantendrá la estructura visual de TailwindCSS.

## Capabilities

### New Capabilities
- `analysis-generation-integration`: Capacidad del `NewAnalysisView` de generar análisis de transacciones reales comunicándose con el motor analítico del backend y mapeando correctamente su respuesta.

### Modified Capabilities
Ninguna.

## Impact

- `src/components/NewAnalysisView.tsx`: Refactorización de nomenclatura, y mapeo bidireccional (petición/respuesta) para el nuevo endpoint.
- El diseño y la experiencia de usuario (incluyendo la categorización automática local) se mantendrán idénticos.
