# Spec: Manejo de Excepciones

## 1. Overview
Esta capacidad asegura que todas las interacciones de red desde el frontend hacia el backend puedan capturar de manera robusta las respuestas no exitosas y convertirlas en notificaciones comprensibles para el usuario, respetando los códigos HTTP y formatos estipulados en `docs/EXCEPCIONES_BACKEND.md`.

## 2. Requirements

### 2.1 Mapeo de Códigos HTTP
- Se debe identificar si un status 400 viene acompañado de un `validation_errors`.
- Se debe transformar el status 502 y 503 en mensajes orientados a la resiliencia del servicio Python (e.g. "Servicio de análisis no disponible...").
- Se debe soportar el mapeo del mensaje en status 409 y 404 (para este último teniendo en cuenta que `/eliminar` manda una respuesta no estructurada en `error`).

### 2.2 Tratamiento de Excepciones Genéricas 500
- Todo status 500 debe inspeccionarse mediante su mensaje para deducir casos omitidos de lógica de negocio (Credenciales y Correo Duplicado) por el servicio actual `AuthService`.
- Cualquier otro 500 debe caer en el flujo de mensaje "Error inesperado".

### 2.3 Despliegue en Interfaz
- Los campos de formulario deben recibir *highlighting* con su correspondiente advertencia cuando se procesa un `validation_errors`.
- Acciones globales (eliminar cuenta, agregar transacciones) deben mostrar un aviso (toast, modal, o banner superior) informando del fallo exacto.
