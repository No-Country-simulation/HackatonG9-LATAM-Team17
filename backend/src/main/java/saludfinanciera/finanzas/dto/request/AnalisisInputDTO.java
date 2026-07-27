package saludfinanciera.finanzas.dto.request;

/**
 * Molde exacto para el JSON de Entrada que el Frontend enviará al presionar "Analizar".
 * Usamos Record para asegurar la inmutabilidad de los datos de transferencia.
 */

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;




public record AnalisisInputDTO(

        @NotNull(message = "El ingreso mensual es obligatorio")
        @Positive(message = "El ingreso mensual debe ser un valor positivo")
        @JsonProperty("ingreso_mensual")
        double ingresoMensual,


        @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @JsonProperty("nivel_endeudamiento")
        int nivelEndeudamiento,


        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,


        @NotNull
        @JsonProperty("descripcion")
        String descripcion,

        @NotNull(message = "El valor es obligatorio")
        @Positive
        @JsonProperty("valor")
        Double valor
) {
}