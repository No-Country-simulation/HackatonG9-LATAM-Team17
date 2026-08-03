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

        @NotNull
        @JsonProperty("descripcion")
        String descripcion,

        @NotNull(message = "El valor es obligatorio")
        @Positive
        @JsonProperty("valor")
        Double valor,

        @JsonProperty("historial_transacciones")
        List<@Valid TransaccionItemDTO>historialTransacciones
){
}