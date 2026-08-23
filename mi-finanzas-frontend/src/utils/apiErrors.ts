export interface ApiErrorResponse {
  general: string;
  validationErrors?: Record<string, string>;
  retryable?: boolean;
}

/**
 * Procesa una respuesta HTTP fallida y extrae o deduce un mensaje de error amigable,
 * soportando la estructura de excepciones del backend Spring Boot.
 */
export async function manejarRespuestaError(response: Response): Promise<ApiErrorResponse> {
  let body: any = {};

  try {
    body = await response.json();
  } catch (e) {
    // Si falla el parseo JSON, continuamos con body vacío
  }

  switch (response.status) {
    case 400:
      return {
        general: body.message || 'Error de validación en los datos enviados.',
        validationErrors: body.validation_errors
      };

    case 401:
      return {
        general: 'Credenciales inválidas. Si eres un nuevo usuario, regístrate.'
      };

    case 404:
      // Nota: /auth/eliminar usa "error", el resto usa "message"
      return {
        general: body.message || body.error || 'Recurso no encontrado.'
      };

    case 409:
      return {
        general: body.detail || body.message || 'Conflicto con los datos existentes.'
      };

    case 415:
      return {
        general: 'Formato de solicitud no soportado. Asegúrate de enviar JSON.'
      };

    case 502:
    case 503:
      return {
        general: 'El servicio de análisis no está disponible, intenta más tarde.',
        retryable: true
      };

    case 500:
    default:
      return {
        general: body.message || 'Ocurrió un error inesperado.'
      };
  }
}
