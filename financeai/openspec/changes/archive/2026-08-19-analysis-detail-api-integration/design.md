## Context

El componente `AnalysisDetailModal.tsx` renderiza un reporte financiero altamente visual. Actualmente depende de una interfaz llamada `AnalysisReport`. El backend, en cambio, retorna un objeto mucho más sencillo (`AnalisisOutputDTO`) que no posee atributos visuales (colores, porcentajes, iconos). Para respetar la restricción arquitectónica de no tocar el backend, debemos adaptar los datos en el frontend.
Adicionalmente, se debe transicionar la nomenclatura al español (`camelCase`) según las nuevas reglas globales.

## Goals / Non-Goals

**Goals:**
- Crear una capa de transformación que reciba `AnalisisOutputDTO` y genere un objeto con todas las propiedades visuales necesarias para `AnalysisDetailModal.tsx`.
- Refactorizar las interfaces de TypeScript de `AnalysisDetailModal.tsx` al español sin alterar el renderizado UI final.

**Non-Goals:**
- No se realizarán llamadas HTTP dentro del propio `AnalysisDetailModal.tsx` (seguirá siendo un componente presentacional).
- No se modificarán otros componentes que no formen parte de la jerarquía directa del modal.
- No se alterarán los endpoints de Java Spring Boot.

## Decisions

### 1. Refactorización de Tipos (TypeScript)
Para cumplir con la regla de idioma, se renombrarán las propiedades de `AnalysisReport` al español, resultando en:

```typescript
export interface DistribucionCategoria {
  categoria: string;
  monto: number;
  porcentaje: number;
  colorHex: string;
}

export interface SugerenciaAccion {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  impacto: string;
  etiquetaAccion?: string;
  tipoEstado?: 'danger' | 'warning' | 'success' | 'info';
  completada?: boolean;
}

export interface ReporteAnalisis {
  id: string;
  fecha: string;
  marcaTiempo: number;
  totalGastado: number;
  puntajeSalud: number;
  estadoSalud: 'Excelente' | 'Estable' | 'Critico'; // Adaptado de HealthStatus
  mensajeMotivador: string;
  narrativaIa?: string;
  logroSemanal?: {
    titulo: string;
    porcentajeGanancia: number;
    horasRestantes: number;
  };
  distribucionCategorias: DistribucionCategoria[];
  recomendaciones: SugerenciaAccion[];
}
```

### 2. Función Mapeadora (`mapearAnalisisDTO`)
Se creará una función de utilidad (posiblemente en `src/utils/mapeadores.ts`) que tome el DTO:
- Convertirá el `resumen_gastos` (Map<String, Double>) en un arreglo de `DistribucionCategoria`, calculando porcentajes y asignando colores fijos (ej. Alimentación -> `#4648d4`).
- Convertirá la lista de strings `recomendaciones` en un arreglo de `SugerenciaAccion`, infiriendo el `tipoEstado` (warning/info) mediante un análisis básico de palabras clave (ej. "Reduce" -> warning).

### 3. Propiedades del Modal
El modal `AnalysisDetailModal.tsx` actualizará sus `props`:
```typescript
interface PropsModalDetalleAnalisis {
  reporte: ReporteAnalisis | null;
  alCerrar: () => void;
}
```

## Risks / Trade-offs

- **Risk:** La inferencia de colores y alertas desde el frontend puede ser inexacta si el backend envía categorías desconocidas. 
  - **Mitigation:** Proveer un color por defecto (`#e1e3e4`) y estado info por defecto para categorías o recomendaciones no mapeadas explícitamente.
- **Risk:** Romper los datos mockeados actuales (ej. `MOCK_HISTORY`).
  - **Mitigation:** Se deberán actualizar los mocks existentes en la base de código local para que usen las nuevas llaves en español.
