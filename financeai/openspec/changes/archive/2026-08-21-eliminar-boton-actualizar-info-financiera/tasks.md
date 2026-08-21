## 1. Actualizar `src/components/NewAnalysisView.tsx`

- [x] 1.1 Remover la declaración de la constante `tieneInformacionBase`.
- [x] 1.2 Remover la prop `disabled={tieneInformacionBase}` del input "Ingreso Mensual Total".
- [x] 1.3 Remover la prop `disabled={tieneInformacionBase}` del input "Valor Total Deudas".
- [x] 1.4 Remover la prop `disabled={tieneInformacionBase}` del select "Frecuencia de Ahorro".
- [x] 1.5 Eliminar todo el bloque condicional `{tieneInformacionBase && (...)}` que renderiza el botón "Actualizar Información Financiera".
- [x] 1.6 Actualizar el hook `useEffect` para pre-cargar los estados con los datos guardados en `userProfile` (ej. del Onboarding).
