## Context

El componente `SettingsProfileView.tsx` actualmente permite editar la contraseña, lo cual no está soportado adecuadamente por el backend ni pertenece puramente a los datos de la app. Además expone configuraciones financieras detalladas ("Fondo de Emergencia" y "Pago mensual de deuda") y permite alterar el "Nivel de Endeudamiento", lo cual no debería ser manipulado manualmente en este punto, sino que debería extraerse del estado de los análisis (`ReporteAnalisis`) o de los datos consolidados en `userProfile`. Asimismo, `ReportsView.tsx` usa datos estáticos para visualizar métricas, provocando que la aplicación se sienta estática en la pestaña de informes.

## Goals / Non-Goals

**Goals:**
- Remover todo el HTML/Lógica de edición de contraseñas de `SettingsProfileView.tsx`.
- Eliminar de `SettingsProfileView.tsx` las variables de estado y JSX para "Fondo de Emergencia" y "Pago mensual de deuda".
- Cambiar la representación del "Nivel de Endeudamiento" en `SettingsProfileView.tsx` pasando de ser un slider `<input type="range">` a un progress bar de solo-lectura, idéntico al componente que se muestra en la vista de reportes.
- Alimentar los componentes de `ReportsView.tsx` con datos reales que provienen de `userProfile` (ej. `userProfile.ratioDeuda`, `userProfile.frecuenciaAhorro`) y del array de historiales (`currentReport`).

**Non-Goals:**
- No se crearán endpoints de actualización en el backend (ej. para contraseñas). Todo se maneja a nivel de UI (ocultando los elementos).
- No se alterará profundamente la lógica de validación del onboarding, ya que fue cubierta en un cambio anterior.

## Decisions

- **UI del Nivel de Endeudamiento en `SettingsProfileView.tsx`**: 
  El input tipo range se reemplazará por el siguiente patrón JSX (reutilizado de `ReportsView`):
  ```tsx
  <div className="h-1.5 w-full bg-[#f3f4f5] rounded-full overflow-hidden">
    <div className="h-full bg-[#fd933d] rounded-full transition-all duration-500" style={{ width: `${userProfile.ratioDeuda || 0}%` }} />
  </div>
  ```
  Esto garantiza que el progreso es estático y unificado en diseño (Premium UX).
  
- **Eliminación de Data Hardcodeada en `ReportsView.tsx`**:
  Variables locales en `ReportsView.tsx` (como las categorías mockeadas en los gráficos si existen) serán alimentadas con el prop `currentReport` que contiene las métricas exactas del último análisis (`distribucionCategorias`, `totalGastado`, `puntajeSalud`).

- **Limpieza de Hooks y Props**:
  Limpiar en `SettingsProfileView.tsx` los states: `contrasenaActual`, `nuevaContrasena`, `confirmarContrasena`, `fondoEmergencia`, `pagoMensualDeuda` y removerlos del objeto devuelto en `manejarGuardarFinanciero`.

## Risks / Trade-offs

- [Riesgo] Al remover los campos "Fondo de Emergencia" y "Pago mensual de deuda" del perfil, el usuario no podrá editarlos después del onboarding/análisis.
  -> Mitigación: El backend ya no tiene un endpoint de actualización de perfil (`PUT /api/profile`); toda la información reingresa cuando el usuario hace un "Nuevo Análisis". Así que removerlos del panel de Ajustes es de hecho lo arquitectónicamente correcto con el esquema actual.
