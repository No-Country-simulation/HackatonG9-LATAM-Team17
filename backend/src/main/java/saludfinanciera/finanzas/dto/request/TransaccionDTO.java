package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

// Usamos 'record' (característica de Java 14+) para crear objetos inmutables de transferencias de datos sin boilerplate (getters, equals, hashCode).
public record TransaccionDTO(

        @NotBlank(message = "El ID de usuario es obligatorio")
        @JsonProperty("usuario_id")
        String usuarioId,

        @NotNull(message = "El monto no puede ser nulo")
        @Positive(message = "El monto debe ser un valor positivo mayor a cero")
        @JsonProperty("monto")
        Double monto,

        @NotBlank(message = "El tipo de transacción es obligatorio")
        @Pattern(regexp = "^(?i)(INGRESO|EGRESO)$", message = "El tipo debe ser INGRESO o EGRESO")
        @JsonProperty("tipo")
        String tipo,

        @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,

        @JsonProperty("categoria")
        String categoria,

        @PastOrPresent(message = "La fecha de la transacción no puede ser futura")
        @JsonProperty("fecha_transaccion")
        LocalDateTime fechaTransaccion
) {}