## ADDED Requirements

### Requirement: Parseo correcto de historial paginado
El sistema DEBE leer `data.content` (y no `data` directamente) al procesar la respuesta de `GET /api/v1/finanzas/historial`, ya que el backend devuelve un objeto `Page<AnalisisFinanciero>` con metadata de paginación.

#### Scenario: Carga inicial de historial exitosa
- **WHEN** `App.tsx` recibe la respuesta de `/api/v1/finanzas/historial`
- **THEN** el sistema extrae el array de análisis desde `response.content`, lo mapea a `ReporteAnalisis[]` y lo asigna a `analysisHistory` y a `currentReport` (primer elemento)

#### Scenario: Historial vacío devuelto por el backend
- **WHEN** la respuesta contiene `"content": []` o `"empty": true`
- **THEN** `analysisHistory` se queda como `[]` y no se produce ningún error en consola

#### Scenario: Respuesta inesperada o malformada
- **WHEN** la propiedad `content` no existe en la respuesta o no es un array
- **THEN** el sistema aplica el fallback `data?.content ?? []` y registra una advertencia sin romper la UI

---

### Requirement: Mapeo centralizado del historial
El sistema DEBE transformar cada ítem crudo del backend en un objeto `ReporteAnalisis` completo y tipado antes de guardarlo en el estado global de `App.tsx`. Esta transformación DEBE ser realizada por la función `mapearItemHistorial` ubicada en `src/utils/mapeadores.ts`.

#### Scenario: Item histórico con recomendaciones como strings
- **WHEN** el backend devuelve `"recomendaciones": ["Reduce gastos", "Ahorra más"]`
- **THEN** el mapeador convierte cada string a un objeto `Recomendacion` con `id`, `titulo`, `descripcion`, `categoria`, `impacto` y `tipoEstado` inferidos

#### Scenario: Item histórico sin recomendaciones
- **WHEN** el backend devuelve `"recomendaciones": []` o el campo está ausente
- **THEN** el mapeador asigna `recomendaciones: []` sin error

#### Scenario: Item histórico con perfil crudo del backend
- **WHEN** el backend devuelve `"perfilFinanciero": "Observación"` o `"Riesgo"`
- **THEN** el mapeador aplica `normalizarPerfil()` y el campo queda como `"En observación"` o `"En riesgo"` respectivamente

#### Scenario: Item con transacciones para calcular totalGastado
- **WHEN** el backend devuelve `"transacciones": [{ "valor": 120 }, { "valor": 50 }]`
- **THEN** el mapeador calcula `totalGastado = 170`

---

### Requirement: HistoryView como componente presentacional
`HistoryView.tsx` NO DEBE realizar fetch propio al endpoint `/api/v1/finanzas/historial`. DEBE renderizar el prop `analysisHistory` recibido desde `App.tsx`.

#### Scenario: Navegación a la pestaña Historial con datos ya cargados
- **WHEN** el usuario navega a `/historial` y `analysisHistory` ya fue cargado por `App.tsx`
- **THEN** `HistoryView` muestra el listado sin realizar ninguna llamada de red adicional

#### Scenario: Análisis generado durante la sesión
- **WHEN** el usuario genera un nuevo análisis y `App.tsx` actualiza `analysisHistory`
- **THEN** `HistoryView` refleja el nuevo análisis inmediatamente al navegar a la pestaña, sin necesidad de hacer un fetch

---

### Requirement: Recomendaciones del Dashboard enlazadas al análisis de origen
El botón "Ver detalles" de cada recomendación en la sección "Recomendaciones del Experto" del Dashboard DEBE abrir el `AnalysisDetailModal` del análisis en que se generó esa recomendación, no siempre el último análisis.

#### Scenario: Recomendación de un análisis histórico
- **WHEN** el usuario hace clic en "Ver detalles" de una recomendación etiquetada con una fecha anterior
- **THEN** se abre el `AnalysisDetailModal` mostrando los datos del análisis correspondiente a esa fecha

#### Scenario: Recomendación del análisis más reciente
- **WHEN** el usuario hace clic en "Ver detalles" de una recomendación del último análisis
- **THEN** se abre el `AnalysisDetailModal` del análisis más reciente (comportamiento ya correcto)
