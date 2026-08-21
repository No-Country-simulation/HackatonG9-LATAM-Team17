# Capability: edicion-protegida-perfil

## Purpose
TBD: Proteger los campos del perfil de usuario mediante un modo de edición explícito para evitar modificaciones accidentales.

## Requirements

### Requirement: Edición protegida del perfil de usuario
El sistema DEBE requerir una acción explícita por parte del usuario para habilitar la edición de los campos del perfil.

#### Scenario: Usuario visualiza su perfil de configuración
- **WHEN** el usuario navega a la sección de configuración del perfil.
- **THEN** los campos del formulario se presentan deshabilitados (bloqueados para escritura).
- **AND** se muestra un botón para habilitar el modo de "Edición".

#### Scenario: Usuario habilita y guarda la configuración
- **WHEN** el usuario hace clic en el botón de edición.
- **THEN** los campos se vuelven editables.
- **WHEN** el usuario confirma los cambios,
- **THEN** los campos se guardan y el formulario vuelve al estado deshabilitado.


<!-- Merged from refactor-perfil-y-reportes -->
## MODIFIED Requirements

### Requirement: Edición protegida del perfil de usuario
El sistema DEBE requerir una acción explícita por parte del usuario para habilitar la edición de los campos básicos del perfil. Sin embargo, ciertos parámetros financieros (como el nivel de endeudamiento) no SERÁN editables directamente por el usuario; en su lugar, se reflejarán visualmente como información calculada o de estado (solo lectura). La edición de contraseña NO SERÁ accesible desde este componente.

#### Scenario: Usuario visualiza su perfil de configuración
- **WHEN** el usuario navega a la sección de configuración del perfil.
- **THEN** los campos del formulario se presentan deshabilitados (bloqueados para escritura).
- **AND** el campo "Nivel de Endeudamiento" se muestra estático, similar a un reporte de progreso.
- **AND** se muestra un botón para habilitar el modo de "Edición".

#### Scenario: Usuario habilita y guarda la configuración
- **WHEN** el usuario hace clic en el botón de edición.
- **THEN** los campos básicos (nombre, correo) se vuelven editables.
- **AND** el "Nivel de Endeudamiento" sigue siendo estático.
- **WHEN** el usuario confirma los cambios,
- **THEN** los campos se guardan localmente y el formulario vuelve al estado deshabilitado.


<!-- Merged from onboarding-financiero-base -->
## MODIFIED Requirements

### Requirement: Edición protegida del perfil de usuario
El sistema DEBE requerir una acción explícita por parte del usuario para habilitar la edición de los campos del perfil. Además, este será el único lugar autorizado para modificar la Información Financiera Base recabada durante el onboarding.

#### Scenario: Usuario visualiza su perfil de configuración
- **WHEN** el usuario navega a la sección de configuración del perfil.
- **THEN** los campos del formulario se presentan deshabilitados (bloqueados para escritura).
- **AND** se muestra un botón para habilitar el modo de "Edición".

#### Scenario: Usuario habilita y guarda la configuración
- **WHEN** el usuario hace clic en el botón de edición.
- **THEN** los campos se vuelven editables.
- **WHEN** el usuario confirma los cambios,
- **THEN** los campos se guardan y el formulario vuelve al estado deshabilitado.
