package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "Estructura individual para un ítem del historial de transacciones")
public record TransaccionItemDTO(

        @Schema(
                description = "Fecha de la transacción en formato YYYY-MM-DD",
                example = "2026-08-01"
        )
        @JsonProperty("fecha")
        String fecha,

        @Schema(
                description = "Descripción o concepto del movimiento",
                example = "Pago de servicio de Internet"
        )
        @JsonProperty("descripcion")
        String descripcion,

        @Schema(
                description = "Monto de la transacción",
                example = "12500.50"
        )
        @JsonProperty("monto")
        BigDecimal monto,

        @Schema(
                description = "Categoría del movimiento. Si se envía vacía o nula, será procesada por el microservicio NLP.",
                example = "SERVICIOS",
                nullable = true
        )
        @JsonProperty("categoria")
        String categoria
) {
}
