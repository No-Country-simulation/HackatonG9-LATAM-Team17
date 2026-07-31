package saludfinanciera.finanzas.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponseDTO(
        int status,
        String error,
        String message,
        Map<String, String> validationErrors, // <--- Lista/Mapa con los detalles de cada campo
        LocalDateTime timestamp
) {
    // Constructor para errores generales (sin detalle de campos)
    public ErrorResponseDTO(int status, String error, String message) {
        this(status, error, message, null, LocalDateTime.now());
    }
    // Constructor para errores de validación DTO
    public ErrorResponseDTO(int status, String error, String message, Map<String, String> validationErrors) {
        this(status, error, message, validationErrors, LocalDateTime.now());
    }
}
