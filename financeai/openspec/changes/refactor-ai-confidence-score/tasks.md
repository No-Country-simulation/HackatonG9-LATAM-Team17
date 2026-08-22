## 1. Actualización de Tipos y Mapeo Principal

- [x] 1.1 En `src/types.ts`, renombrar el alias `EstadoSalud` a `PerfilFinanciero`.
- [x] 1.2 En `src/types.ts`, renombrar `puntajeSalud` a `confianzaModelo` y `estadoSalud` a `perfilFinanciero` en la interfaz `ReporteAnalisis` y donde aplique.
- [x] 1.3 En `NewAnalysisView.tsx`, actualizar el mapeo para asignar `data.probabilidad` a `confianzaModelo` y `data.perfil_financiero` a `perfilFinanciero` al construir el reporte.
- [x] 1.4 En `App.tsx` y `HistoryView.tsx`, asegurar la compatibilidad con el localStorage anterior leyendo `confianzaModelo ?? puntajeSalud` y `perfilFinanciero ?? estadoSalud`, y actualizar las reglas de ordenación en el historial.

## 2. Refactorización de Etiquetas en Vistas (Confianza de IA y Perfil)

- [x] 2.1 En `AnalysisDetailModal.tsx`, separar los labels: cambiar "Salud Financiera" por "Perfil Financiero" (usando `perfilFinanciero`) y añadir el label "Nivel de Confianza" leyendo de `confianzaModelo`.
- [x] 2.2 En `AnalysisTimelineModal.tsx`, actualizar las referencias a `confianzaModelo` y `perfilFinanciero`, asegurando que el texto y contexto sean claros.
- [x] 2.3 En `HistoryView.tsx`, reemplazar el uso de variables antiguas en la renderización y separar visualmente el Perfil Financiero del Porcentaje de Confianza (añadiendo el label "Confianza").
- [x] 2.4 En `DashboardView.tsx`, actualizar las referencias a `confianzaModelo` y `perfilFinanciero` en la zona central.

## 3. Corrección Lógica y Visual (Independencia de Estado)

- [x] 3.1 En `AnalysisDetailModal.tsx`, cambiar la condición que escoge la mascota para que dependa únicamente de `perfilFinanciero` (ej. si es "Saludable" o "Excelente" -> Feliz, sino neutro/triste) y no de la matemática de confianza (>= 80).
- [x] 3.2 En `NewAnalysisView.tsx`, simplificar cómo se construyen las `recomendaciones` mockeadas, evaluando quitar los textos como "Calculado por motor" y "Revisar" para no pretender que el backend envió esos datos complejos.
