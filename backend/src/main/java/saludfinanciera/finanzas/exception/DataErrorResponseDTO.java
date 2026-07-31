package saludfinanciera.finanzas.exception;

import java.time.LocalDateTime;

public record DataErrorResponseDTO(
        int status,
        String error,
        String message,
        String detail, // <--- Detalle útil para logs o diagnosticar qué restricción falló
        LocalDateTime timestamp
) {
    public DataErrorResponseDTO(int status, String error, String message, String detail) {
        this(status, error, message, detail, LocalDateTime.now());
    }
}
