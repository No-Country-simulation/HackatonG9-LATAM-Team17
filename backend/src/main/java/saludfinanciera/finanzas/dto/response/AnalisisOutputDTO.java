package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Molde para el JSON de Salida estructurado que el backend responderá al Frontend.
 * Incluye el perfil financiero calculado, métricas de la IA y recomendaciones dinámicas.
 */

public record AnalisisOutputDTO(

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        Double probabilidad,

       // List<String> recomendaciones,

         @JsonProperty("categoria") // Asegúrate de que coincida con el nombre exacto que enviará Python
         List<String> categoria

) {
}