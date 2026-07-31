package saludfinanciera.finanzas.dto.error;

import java.time.LocalDateTime;

public record AIServiceErrorDTO(
        int status,
        String error,
        String message,
        String aiServiceDetail,
        boolean isTimeout, // <--- Le indica al Front si fue por demora para que sugiera "Reintentar"
        LocalDateTime timestamp
) {
    public AIServiceErrorDTO(int status, String error, String message, String aiServiceDetail, boolean isTimeout) {
        this(status, error, message, aiServiceDetail, isTimeout, LocalDateTime.now());
    }
}
