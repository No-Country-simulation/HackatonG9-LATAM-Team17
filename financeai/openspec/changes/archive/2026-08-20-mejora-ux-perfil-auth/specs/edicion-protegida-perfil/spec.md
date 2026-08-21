## ADDED Requirements

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
