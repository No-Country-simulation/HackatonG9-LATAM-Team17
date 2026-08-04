package saludfinanciera.finanzas.dto.error;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Estructura de respuesta estandarizada para errores de validación de datos o violaciones de restricciones de base de datos")
public record DataErrorResponseDTO(

        @Schema(
                description = "Código de estado HTTP de la respuesta de error",
                example = "400"
        )
        @JsonProperty("status")
        int status,

        @Schema(
                description = "Descripción corta del tipo de error o código de estado HTTP",
                example = "Bad Request"
        )
        @JsonProperty("error")
        String error,

        @Schema(
                description = "Mensaje general del error orientado a la aplicación",
                example = "Error de validación en la estructura de los datos recibidos"
        )
        @JsonProperty("message")
        String message,

        @Schema(
                description = "Detalle técnico del fallo o restricción específica que fue violada (útil para logs y diagnóstico)",
                example = "El campo 'ingreso_mensual' no puede ser nulo ni negativo"
        )
        @JsonProperty("detail")
        String detail, // <--- Detalle útil para logs o diagnosticar qué restricción falló

        @Schema(
                description = "Fecha y hora exacta en la que se registró el error",
                example = "2026-08-04T11:01:43"
        )
        @JsonProperty("timestamp")
        LocalDateTime timestamp
) {
    public DataErrorResponseDTO(int status, String error, String message, String detail) {
        this(status, error, message, detail, LocalDateTime.now());
    }
}
