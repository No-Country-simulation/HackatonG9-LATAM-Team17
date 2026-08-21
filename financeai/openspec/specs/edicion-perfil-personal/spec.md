# edicion-perfil-personal

**Purpose**: TBD

## ADDED Requirements

### Requirement: Edición de Información Personal
El sistema SHALL permitir al usuario editar su `nombre` y `email` en la sección de Perfil y Ajustes.

#### Scenario: Edición exitosa de información personal
- **WHEN** el usuario ingresa un nuevo nombre o email y envía el formulario
- **THEN** el sistema invoca `PUT /api/v1/auth/usuarios/{id}` y actualiza el estado de la sesión activa en el frontend (ej. Navbar, Sidebar) sin requerir recargar la página.
