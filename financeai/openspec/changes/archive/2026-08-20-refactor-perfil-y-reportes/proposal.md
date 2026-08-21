## Why

Actualmente, el perfil de usuario incluye configuraciones como el cambio de contraseña que no están completamente integradas con el backend actual. Además, la vista de perfil contiene parámetros financieros (como el fondo de emergencia y pago de deudas) que causan ruido en la configuración base, y un slider de nivel de endeudamiento que debería reflejar un estado calculado (como en los reportes) en lugar de ser un input manual editable. Por último, la vista de Informes muestra datos estáticos mockeados, lo que impide al usuario ver el valor real de sus análisis financieros. Es necesario simplificar el perfil y unificar la presentación de datos reales en todo el frontend.

## What Changes

- **Eliminación de edición de contraseña**: Se removerán los campos y la lógica de "Contraseña Actual" y "Nueva Contraseña" del `SettingsProfileView.tsx`.
- **Simplificación de Parámetros Financieros**: Se eliminarán los campos de "Fondo de Emergencia" y "Pago mensual de deuda" del perfil.
- **Nivel de Endeudamiento Estático**: El slider del nivel de endeudamiento en el perfil se transformará en una barra de progreso estática (solo lectura) que reflejará la información real calculada, manteniendo la estética de la vista de reportes.
- **Conexión de Datos Reales en Informes**: Se eliminarán los hardcodes (datos mockeados) en `ReportsView.tsx` y se alimentarán los componentes visuales con los datos provenientes de los análisis reales (desde `HistoryView` o del estado global `userProfile`).

## Capabilities

### New Capabilities
- `conexion-datos-reales-informes`: Define la inyección y presentación de datos dinámicos provenientes del estado (análisis y perfil) en la vista de reportes, sustituyendo los valores predeterminados.

### Modified Capabilities
- `edicion-protegida-perfil`: Se modifica la capacidad existente para reflejar que la edición de contraseñas ya no está permitida/visible y que ciertos parámetros financieros pasan a ser calculados y de solo-lectura visual en los ajustes.

## Impact

- `src/components/SettingsProfileView.tsx`: Reducción significativa del formulario, alteración de la UI para convertir el input range en una progress bar estática de lectura.
- `src/components/ReportsView.tsx`: Refactorización de las variables internas para consumir estado real.
- Impacto visual positivo: Se mantendrán las directrices premium (glassmorphism, animaciones fluidas, barras de progreso elegantes) pero ahora reflejando exactitud financiera.
