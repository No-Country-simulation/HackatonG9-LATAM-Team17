## Why
El equipo de backend ha implementado un nuevo endpoint para la actualización parcial del perfil del usuario (`PUT /api/v1/auth/usuarios/{id}`). Es necesario integrar este endpoint en la vista de Ajustes y Perfil (`SettingsProfileView.tsx`) para permitir la edición de la Información Personal (nombre y correo). Además, se debe refactorizar la sección de Parámetros Financieros en esta misma vista para que sea únicamente de lectura (estática) y muestre la información del último análisis, incluyendo el campo de Deuda Total que faltaba.

## What Changes
- Integrar `PUT /api/v1/auth/usuarios/{id}` en `SettingsProfileView.tsx` para permitir guardar cambios en `nombre` y `email`.
- Convertir la sección de "Parámetros Financieros" en `SettingsProfileView.tsx` a modo de solo lectura (estática).
- Agregar la visualización del campo "Deuda Total" en los Parámetros Financieros de `SettingsProfileView.tsx`.
- Modificar `NewAnalysisView.tsx` para asegurar que los campos de Información Financiera Base se soliciten siempre en un nuevo análisis y que dichos parámetros sean los que se visualizan de forma estática en el perfil.

## Capabilities

### New Capabilities
- `edicion-perfil-personal`: Capacidad de editar el nombre y correo del usuario a través del nuevo endpoint PUT del backend.

### Modified Capabilities
- `restriccion-campos-financieros`: Los parámetros financieros en la vista de perfil ya no son editables; pasan a ser de solo lectura.

## Impact
- `src/components/SettingsProfileView.tsx`: Cambios significativos en la lógica de guardado y en la UI de los parámetros financieros.
- `src/components/NewAnalysisView.tsx`: Ajustes para asegurar el ingreso de datos en cada nuevo análisis.
- `src/services/api.ts` (o donde se manejen las llamadas HTTP): Nueva función para invocar `PUT /api/v1/auth/usuarios/{id}`.
