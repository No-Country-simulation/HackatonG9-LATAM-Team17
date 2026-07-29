package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/**
 * Molde para el JSON de Salida estructurado que el backend responderá al Frontend.
 * Incluye el perfil financiero calculado, métricas de la IA, resumen de gastos y recomendaciones.
 */
public record AnalisisOutputDTO(

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        @JsonProperty("probabilidad")
        Double probabilidad,

        // Map representa un objeto JSON con pares clave-valor (ej. "alimentacion": 420.0)
        @JsonProperty("resumen_gastos")
        Map<String, Double> resumenGastos,

        @JsonProperty("recomendaciones")
        List<String> recomendaciones

) {
}