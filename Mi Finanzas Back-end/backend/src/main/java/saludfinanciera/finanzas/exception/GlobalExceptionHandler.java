package saludfinanciera.finanzas.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import saludfinanciera.finanzas.dto.error.DataErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.ErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.PythonServiceErrorDTO;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Captura recursos no encontrados (404 Not Found)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage(),
                Map.of()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 2. Captura violaciones de integridad de datos en BD (409 Conflict)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<DataErrorResponseDTO> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        DataErrorResponseDTO errorResponse = new DataErrorResponseDTO(
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                "Error al procesar la información en la base de datos.",
                "Asegúrate de que los datos obligatorios estén presentes y no haya registros duplicados."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // 3. Captura intentos de registro de entidades duplicadas (409 Conflict)
    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<DataErrorResponseDTO> handleEntityAlreadyExists(EntityAlreadyExistsException ex) {
        DataErrorResponseDTO errorResponse = new DataErrorResponseDTO(
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                ex.getMessage(),
                "El recurso que intentas registrar ya existe en el sistema."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // NUEVO: Captura fallos de autenticación (401 Unauthorized)
    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthenticationFailed(AuthenticationFailedException ex) {
        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                ex.getMessage(),
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // 4. Captura errores de validación de Bean Validation con @Valid (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("⚠️ Fallo de validación en los datos de entrada: {}", errors);

        ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Error de validación en los datos enviados.",
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 5. Captura cuando el servicio de Python responde con un status HTTP 4xx/5xx (502 Bad Gateway)
    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<PythonServiceErrorDTO> handlePythonServiceException(HttpStatusCodeException ex) {
        PythonServiceErrorDTO errorResponse = new PythonServiceErrorDTO(
                HttpStatus.BAD_GATEWAY.value(),
                HttpStatus.BAD_GATEWAY.getReasonPhrase(),
                "El servicio de procesamiento financiero (Python) no pudo completar la solicitud.",
                "Detalle del servicio aguas abajo: " + ex.getStatusCode() + " - " + ex.getStatusText()
        );
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(errorResponse);
    }

    // 6. Captura cuando el servicio de Python está caído o inalcanzable (503 Service Unavailable)
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<PythonServiceErrorDTO> handlePythonConnectionException(ResourceAccessException ex) {
        PythonServiceErrorDTO errorResponse = new PythonServiceErrorDTO(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(),
                "No se pudo establecer conexión con el motor de análisis en Python.",
                "El servicio externo está fuera de línea o no responde dentro del tiempo límite establecido."
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
    }

    // 7. Captura cualquier otro error no controlado (500 Internal Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGlobalException(Exception ex) {
        log.error("❌ Excepción no controlada interceptada: ", ex);

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Ocurrió un error interno e inesperado en el servidor.",
                Map.of()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // 8. Captura tipos de contenido (Content-Type) no soportados (415 Unsupported Media Type)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponseDTO> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        log.warn("⚠️ Content-Type no soportado: {}", ex.getContentType());

        ErrorResponseDTO error = new ErrorResponseDTO(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
                HttpStatus.UNSUPPORTED_MEDIA_TYPE.getReasonPhrase(),
                "El tipo de contenido enviado no es soportado. Si estás enviando 'datos' en multipart/form-data, asegúrate de establecer su Content-Type como 'application/json'.",
                Map.of()
        );

        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(error);
    }
}