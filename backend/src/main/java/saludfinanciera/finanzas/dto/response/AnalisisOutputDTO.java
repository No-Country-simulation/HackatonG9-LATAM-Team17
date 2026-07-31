package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record AnalisisOutputDTO(

        Map<String, String> categorias,

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        Double probabilidad
){
}