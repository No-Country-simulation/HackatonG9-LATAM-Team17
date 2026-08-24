package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Schema(description = "DTO que representa el detalle de una transacción financiera")
public record TransaccionDTO(

        @Schema(
                description = "Descripción o concepto de la transacción",
                example = "Compra en supermercado",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,

        @Schema(
                description = "Monto monetario de la transacción",
                example = "1500.50",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.01"
        )
        @NotNull(message = "El valor de la transacción no puede ser nulo")
        @Positive(message = "El valor de la transacción debe ser mayor a cero")
        @JsonProperty("valor")
        Double valor,

        @Schema(
                description = "Fecha y hora en que se realizó la transacción (formato ISO-8601)",
                example = "2026-08-14T10:30:00.000Z",
                requiredMode = Schema.RequiredMode.NOT_REQUIRED,
                type = "string",
                format = "date-time"
        )
        // Patrón flexible para aceptar milisegundos opcionales y la terminación 'Z' sin romper la app
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][.SS][.S]['Z']", timezone = "UTC")
        @JsonProperty("fecha_transaccion")
        LocalDateTime fechaTransaccion
) {}