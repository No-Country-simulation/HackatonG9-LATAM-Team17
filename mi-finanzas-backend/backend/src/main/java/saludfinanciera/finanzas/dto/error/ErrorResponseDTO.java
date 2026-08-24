package saludfinanciera.finanzas.dto.error;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Estructura estándar para respuestas de error genéricas y fallos de validación de campos")
public record ErrorResponseDTO(

        @Schema(
                description = "Código de estado HTTP del error",
                example = "400"
        )
        @JsonProperty("status")
        int status,

        @Schema(
                description = "Nombre o categoría corta del error HTTP",
                example = "Bad Request"
        )
        @JsonProperty("error")
        String error,

        @Schema(
                description = "Mensaje global descriptivo sobre el fallo de la solicitud",
                example = "Uno o más campos enviados en la petición no cumplen con las validaciones requeridas"
        )
        @JsonProperty("message")
        String message,

        @Schema(
                description = "Mapa de errores de validación por campo (clave: nombre del campo, valor: motivo del fallo)",
                example = "{\"monto\": \"El monto debe ser un valor positivo\", \"tipo\": \"El tipo de transacción es obligatorio\"}",
                nullable = true
        )
        @JsonProperty("validation_errors")
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