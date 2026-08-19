## Context
El componente `DashboardView.tsx` incluye un formulario "Quick Add" para transacciones. Actualmente utiliza la función local `autoCategorizeDescription` para predecir la categoría basada únicamente en la descripción mientras el usuario teclea. La API documentada ofrece un endpoint de clasificación inteligente `POST /api/v1/finanzas/clasificar` que, en un flujo ideal, debería ser la única fuente de verdad para clasificar gastos con IA.

## Goals / Non-Goals

**Goals:**
- Conectar la acción de agregar una transacción en `DashboardView.tsx` al endpoint `/clasificar` para que la IA en el backend categorice el gasto real.
- Mantener la preview instantánea en el frontend sin cambios usando el categorizador local, dado que la API exige el parámetro `valor` que el usuario podría no haber tipeado aún.
- Traducir al español todas las variables de estado relativas a este flujo en `DashboardView` para cumplir con las convenciones de la base de código.
- Mantener inalterado el 100% del diseño UI (TailwindCSS, colores, iconos, transiciones).

**Non-Goals:**
- No se modificará el backend.
- No se conectarán los datos históricos o el gráfico circular (esto ya se maneja en el flujo general o en futuros cambios).
- No se alterará el componente contenedor (`App.tsx`), los props de `DashboardView` se mantienen, solo cambia el estado interno.

## Decisions

**1. Hibridación del categorizador (Local + API)**
- *Decisión*: Se usará `autoCategorizeDescription` para previsualizar la categoría en vivo. Al enviar el formulario (`handleQuickAdd`), se realizará una llamada `fetch` asíncrona a `/api/v1/finanzas/clasificar` pasando el `valor` y la `descripcion`. Si la API falla, se usa el resultado del categorizador local.
- *Racional*: Es la única forma de cumplir la regla "Los endpoints NO se modificarán" (ya que requiere `valor`) y al mismo tiempo conservar la UX "premium" e interactiva en la que el sistema predice en tiempo real.

**2. Renombramiento de Estado Local**
- *Decisión*: Se cambiarán nombres de estado `quickDesc` -> `descripcionRapida`, `quickAmount` -> `valorRapido`, `quickCategory` -> `categoriaRapida`, `isModelFailed` -> `modeloFallo`, `manualOverrideActive` -> `sobreescrituraManualActiva`.
- *Racional*: Cumplir con las convenciones de Nomenclatura, advirtiendo al usuario en el `proposal.md` y alineando el estado con el campo `valor` de la API.

## Riesgos / Trade-offs

- **[Riesgo]** Latencia al agregar transacción: La llamada a la API podría retrasar la inserción de la transacción en la interfaz.
  - **Mitigación**: Mostrar el botón de `isSubmitting` (estado de carga) en el botón "Agregar" para dar retroalimentación visual al usuario mientras la API de Python clasifica el gasto.

## Estados y Propiedades (React)

```typescript
// Estados modificados en DashboardView.tsx
const [descripcionRapida, setDescripcionRapida] = useState('');
const [valorRapido, setValorRapido] = useState('');
const [categoriaRapida, setCategoriaRapida] = useState<ExpenseCategory>('Alimentación');
const [modeloFallo, setModeloFallo] = useState(false);
const [sobreescrituraManualActiva, setSobreescrituraManualActiva] = useState(false);
const [clasificandoAPI, setClasificandoAPI] = useState(false); // NUEVO estado de carga
```
