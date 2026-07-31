package saludfinanciera.finanzas.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;

import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

@RestControllerAdvice
public class GlobalExceptionHandler {


    // 1. Captura errores de validación de DTOs (@Valid / @NotNull / @Positive / etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();

        // Extraemos cada campo que falló y su mensaje de error
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Error de validación en los datos ingresados",
                fieldErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 2. Captura recursos no encontrados (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 3. Captura cualquier otro error no controlado (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGlobalException(Exception ex) {
        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<DataErrorResponseDTO> handleDataIntegrityViolation(DataIntegrityViolationException ex) {

        DataErrorResponseDTO errorResponse = new DataErrorResponseDTO(
                HttpStatus.CONFLICT.value(),
                "Data Conflict",
                "Error al procesar la información en la base de datos.",
                "Asegúrate de que los datos obligatorios estén presentes y no haya registros duplicados."
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<DataErrorResponseDTO> handleEntityAlreadyExists(EntityAlreadyExistsException ex) {

        DataErrorResponseDTO errorResponse = new DataErrorResponseDTO(
                HttpStatus.CONFLICT.value(), // 409 Conflict
                "Conflicto de entidad duplicada",
                ex.getMessage(),
                "El recurso que intentas registrar ya existe en la base de datos."
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // 1. Captura cuando el servicio de Python responde con un status 4xx o 5xx
    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<PythonServiceErrorDTO> handlePythonServiceException(HttpStatusCodeException ex) {

        DataErrorResponseDTO response;
        PythonServiceErrorDTO errorResponse = new PythonServiceErrorDTO(
                HttpStatus.BAD_GATEWAY.value(), // 502 Bad Gateway es el status correcto cuando un servicio aguas abajo falla
                "Python Microservice Error",
                "El servicio de procesamiento financiero no pudo completar la solicitud.",
                "Detalle del servicio: " + ex.getStatusCode() + " - " + ex.getStatusText()
        );

        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(errorResponse);
    }

    // 2. Captura cuando el servicio de Python está caído, inalcanzable o dio Timeout
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<PythonServiceErrorDTO> handlePythonConnectionException(ResourceAccessException ex) {

        PythonServiceErrorDTO errorResponse = new PythonServiceErrorDTO(
                HttpStatus.SERVICE_UNAVAILABLE.value(), // 503 Service Unavailable
                "Service Unavailable",
                "No se pudo establecer conexión con el motor de análisis en Python.",
                "El servicio externo no responde o no se encuentra disponible momentáneamente."
        );

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
    }

    // 1. Captura cuando la llamada a la IA excede el tiempo límite (Timeout)
    @ExceptionHandler({TimeoutException.class, SocketTimeoutException.class})
    public ResponseEntity<AIServiceErrorDTO> handleAITimeoutException(Exception ex) {
        AIServiceErrorDTO error = new AIServiceErrorDTO(
                HttpStatus.GATEWAY_TIMEOUT.value(), // 504 Gateway Timeout
                "AI Service Timeout",
                "El modelo de Inteligencia Artificial tardó demasiado en responder.",
                "La generación de la respuesta superó el tiempo máximo de espera. Intenta nuevamente con una consulta más corta o en unos momentos.",
                true
        );
        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body(error);
    }

    // 2. Captura cuando la IA se cae o responde con un fallo interno de modelo
    @ExceptionHandler(AIServiceUnavailableException.class)
    public ResponseEntity<AIServiceErrorDTO> handleAIServiceUnavailable(AIServiceUnavailableException ex) {
        AIServiceErrorDTO error = new AIServiceErrorDTO(
                HttpStatus.SERVICE_UNAVAILABLE.value(), // 503
                "AI Service Unavailable",
                "El motor de Inteligencia Artificial no está disponible actualmente.",
                ex.getMessage(),
                ex.isTimeout()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
}
