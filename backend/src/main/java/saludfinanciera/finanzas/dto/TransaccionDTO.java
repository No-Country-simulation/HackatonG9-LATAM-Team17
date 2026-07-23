package saludfinanciera.finanzas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransaccionDTO{

    private String id;

    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;

    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser un valor positivo")
    private BigDecimal monto;

    @NotBlank(message = "El tipo de transacción es obligatorio (INGRESO/EGRESO)")
    private String tipo;

    private String categoria; // Opcional, puede venir nulo si lo categoriza Python

}