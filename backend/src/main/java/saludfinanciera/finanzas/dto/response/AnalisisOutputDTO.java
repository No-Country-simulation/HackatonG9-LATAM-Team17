package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record AnalisisOutputDTO(

        List<String> categoria,

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        Double probabilidad
){
}