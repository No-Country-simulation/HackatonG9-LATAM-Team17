package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

// Usamos 'record' (característica de Java 14+) para crear objetos inmutables de transferencias de datos sin boilerplate (getters, equals, hashCode).
public record TransaccionDTO(

        @NotBlank(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,

        @NotNull(message = "El valor de la transacción no puede ser nulo")
        @Positive(message = "El valor de la transacción debe ser mayor a cero")
        @JsonProperty("valor")
        Double valor,


        @JsonProperty("fecha_transaccion")
        LocalDateTime fechaTransaccion
) {}