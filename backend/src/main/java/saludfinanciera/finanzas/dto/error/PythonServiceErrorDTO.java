package saludfinanciera.finanzas.dto.error;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;


@Schema(description = "Estructura de error personalizada para fallos reportados directamente desde el microservicio NLP en Python")
public record PythonServiceErrorDTO(

        @Schema(
                description = "Código de estado HTTP del error devuelto por la integración",
                example = "502"
        )
        @JsonProperty("status")
        int status,

        @Schema(
                description = "Categoría corta o tipo de fallo HTTP",
                example = "Bad Gateway"
        )
        @JsonProperty("error")
        String error,

        @Schema(
                description = "Mensaje descriptivo general sobre el fallo de procesamiento en el microservicio",
                example = "Error de comunicación con el servicio de Inteligencia Artificial"
        )
        @JsonProperty("message")
        String message,

        @Schema(
                description = "Detalle amigable sobre la causa específica reportada por la API de Python NLP",
                example = "El modelo de clasificación de texto devolvió una respuesta no válida para la descripción 'Transacción desconocida'"
        )
        @JsonProperty("python_service_detail")
        String pythonServiceDetail, // <--- Información amigable sobre la falla del microservicio

        @Schema(
                description = "Fecha y hora exacta en la que se capturó la excepción",
                example = "2026-08-04T11:05:00"
        )
        @JsonProperty("timestamp")
        LocalDateTime timestamp
) {
    public PythonServiceErrorDTO(int status, String error, String message, String pythonServiceDetail) {
        this(status, error, message, pythonServiceDetail, LocalDateTime.now());
    }
}
