package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record RespuestaPythonDTO(

        @JsonProperty("probabilidad")
        Double probabilidad,

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        @JsonProperty("categoria") // Asegúrate de que coincida con el nombre exacto que enviará Python
        List<String> categoria
) {
}