package saludfinanciera.finanzas.dto;

/**
 * Molde exacto para el JSON de Entrada que el Frontend enviará al presionar "Analizar".
 * Usamos Record para asegurar la inmutabilidad de los datos de transferencia.
 */

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public record AnalisisInputDTO(

        @JsonProperty("ingreso_mensual")
        double ingresoMensual,

        @JsonProperty("nivel_endeudamiento")
        int nivelEndeudamiento,

        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,

        List<TransaccionDTO> transacciones
) {
}