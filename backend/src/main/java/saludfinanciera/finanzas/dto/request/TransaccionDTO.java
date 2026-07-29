package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// Usamos 'record' (característica de Java 14+) para crear objetos inmutables de transferencias de datos sin boilerplate (getters, equals, hashCode).
public record TransaccionDTO(

        // @NotNull valida que el campo no llegue nulo en el JSON de la petición HTTP.
        @NotNull(message = "La descripción no puede ser nula")
        // @JsonProperty mapea la clave JSON "descripcion" con este atributo en Java.
        @JsonProperty("descripcion")
        String descripcion,

        @NotNull(message = "El valor no puede ser nulo")
        // @Positive asegura que el monto sea estrictamente mayor a 0 (no acepta ceros ni números negativos).
        @Positive(message = "El valor debe ser mayor a cero")
        @JsonProperty("valor")
        double valor
) {}