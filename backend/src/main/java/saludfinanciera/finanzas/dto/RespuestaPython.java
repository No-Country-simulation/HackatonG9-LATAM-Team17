package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record RespuestaPython(


        Double probabilidad,

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        List<String> categorias
){
}
