package saludfinanciera.finanzas.dto.error;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Estructura para representar errores específicos originados durante la comunicación con el microservicio de IA (Python NLP)")
public record AIServiceErrorDTO(

        @Schema(
                description = "Código de estado HTTP del error",
                example = "504"
        )
        @JsonProperty("status")
        int status,

        @Schema(
                description = "Título o categoría corta del tipo de error",
                example = "Gateway Timeout"
        )
        @JsonProperty("error")
        String error,

        @Schema(
                description = "Mensaje explicativo orientado al usuario final",
                example = "El microservicio de IA tardó demasiado en responder"
        )
        @JsonProperty("message")
        String message,

        @Schema(
                description = "Detalle técnico interno devuelto por la excepción de la IA o cliente HTTP",
                example = "Read timed out after 5000ms while calling http://python-nlp-service/api/v1/predict"
        )
        @JsonProperty("ai_service_detail")
        String aiServiceDetail,

        @Schema(
                description = "Bandera booleana que indica al frontend si el fallo fue por timeout para habilitar la sugerencia de 'Reintentar'",
                example = "true"
        )
        @JsonProperty("is_timeout")
        boolean isTimeout, // <--- Le indica al Front si fue por demora para que sugiera "Reintentar"

        @Schema(
                description = "Fecha y hora exacta en la que ocurrió el error",
                example = "2026-08-04T10:59:39"
        )
        @JsonProperty("timestamp")
        LocalDateTime timestamp
) {
    public AIServiceErrorDTO(int status, String error, String message, String aiServiceDetail, boolean isTimeout) {
        this(status, error, message, aiServiceDetail, isTimeout, LocalDateTime.now());
    }
}
