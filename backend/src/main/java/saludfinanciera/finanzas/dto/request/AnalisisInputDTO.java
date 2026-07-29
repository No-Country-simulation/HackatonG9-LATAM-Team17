package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record AnalisisInputDTO(

        @NotNull(message = "El ingreso mensual es obligatorio")
        @Positive(message = "El ingreso mensual debe ser un valor positivo")
        @JsonProperty("ingreso_mensual")
        Double ingresoMensual,

        @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @JsonProperty("nivel_endeudamiento")
        Integer nivelEndeudamiento,

        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,

        // @Valid es crucial: le indica a Spring que DEBE validar los elementos dentro de la lista (las reglas de TransaccionDTO).
        @Valid
        @JsonProperty("transacciones")
        List<TransaccionDTO> transacciones
) {}