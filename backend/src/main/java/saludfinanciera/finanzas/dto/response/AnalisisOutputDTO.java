package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public record AnalisisOutputDTO(


        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        @JsonProperty("probabilidad")
        Double probabilidad,

        @JsonProperty("resumen_gastos")
        Map<String, Object> resumenGastos,

        @JsonProperty("recomendaciones")
        List<String> recomendaciones
){
}