package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TransaccionDTO(

        Long id, @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,

        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser un valor positivo")
        @JsonProperty("monto")
        BigDecimal monto,

        @NotBlank(message = "El tipo de transacción es obligatorio (INGRESO/EGRESO)")
        @JsonProperty("tipo")
        String tipo,

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