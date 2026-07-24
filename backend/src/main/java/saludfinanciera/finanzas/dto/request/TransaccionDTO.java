package saludfinanciera.finanzas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TransaccionDTO(

        @NotBlank(message = "La descripción no puede estar vacía")
        String descripcion,

        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser un valor positivo")
        BigDecimal monto,

        @NotBlank(message = "El tipo de transacción es obligatorio (INGRESO/EGRESO)")
        String tipo,

        String categoria // Opcional, puede venir nulo si lo categoriza Python
){
        // Constructor compacto para normalizar datos de entrada
        public TransaccionDTO {
                if (categoria != null && categoria.isBlank()) {
                        categoria = null; // Convierte "" o "   " a null para Python
                }
        }
}