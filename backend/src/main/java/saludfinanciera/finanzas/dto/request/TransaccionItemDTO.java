package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Estructura individual para un ítem del historial de transacciones")
public record TransaccionItemDTO(

        @Schema(
                description = "Fecha de la transacción en formato YYYY-MM-DD",
                example = "2026-08-01",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "La fecha es obligatoria")
        @JsonFormat(pattern = "yyyy-MM-dd")
        @JsonProperty("fecha")
        LocalDate fecha,
// 1
        @Schema(
                description = "Descripción o concepto del movimiento",
                example = "Pago de servicio de Internet",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,
// 2
        @Schema(
                description = "Monto de la transacción",
                example = "12500.50",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser un valor positivo")
        @JsonProperty("monto")
        BigDecimal monto,
// 3
        @Schema(
                description = "Categoría del movimiento. Si se envía vacía o nula, será procesada por el microservicio NLP.",
                example = "SERVICIOS",
                nullable = true
        )
        @JsonProperty("categoria")
        String categoria
// 4
) {
        // Constructor compacto para normalizar datos de entrada
        public TransaccionItemDTO {
                if (descripcion != null) {
                        descripcion = descripcion.trim();
                }
                if (categoria != null && categoria.isBlank()) {
                        categoria = null;
                } else if (categoria != null) {
                        categoria = categoria.trim().toUpperCase();
                }
        }
}