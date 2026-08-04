package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

@Schema(description = "Estructura para registrar una nueva transacción financiera")
public record TransaccionDTO(

        @Schema(description = "Identificador único de la transacción en PostgreSQL", example = "3")
        @JsonProperty("id")
        Long id,

        @Schema(
                description = "Descripción detallada del movimiento",
                example = "Cobro por Hackathon",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,


        @Schema(
                description = "Monto monetario de la transacción",
                example = "50000.00",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser un valor positivo")
        @JsonProperty("monto")
        BigDecimal monto,


        @Schema(
                description = "Tipo de movimiento financiero",
                example = "INGRESO",
                allowableValues = {"INGRESO", "EGRESO"},
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "El tipo de transacción es obligatorio (INGRESO/EGRESO)")
        @JsonProperty("tipo")
        String tipo,


        @Schema(
                description = "Categoría de la transacción. Si se envía vacía o nula, la IA la categoriza automáticamente.",
                example = "SERVICIOS",
                nullable = true
        )
        @JsonProperty("categoria")
        String categoria, // Opcional, puede venir nulo si lo categoriza Python
        java.time.LocalDateTime fechaTransaccion){
        // Constructor compacto para normalizar datos de entrada
        public TransaccionDTO {
                if (categoria != null && categoria.isBlank()) {
                        categoria = null; // Convierte "" o "   " a null para Python
                }
                // Sanitización opcional de tipo (remueve espacios accidentales y pasa a mayúsculas)
                if (tipo != null) {
                        tipo = tipo.trim().toUpperCase();
                }
        }
}