package saludfinanciera.finanzas.dto.error;

import java.time.LocalDateTime;

public record PythonServiceErrorDTO(
        int status,
        String error,
        String message,
        String pythonServiceDetail, // <--- Información amigable sobre la falla del microservicio
        LocalDateTime timestamp
) {
    public PythonServiceErrorDTO(int status, String error, String message, String pythonServiceDetail) {
        this(status, error, message, pythonServiceDetail, LocalDateTime.now());
    }
}
