package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;
/**
 * Molde para el JSON de Salida estructurado que el backend responderá al Frontend.
 * Incluye el perfil financiero calculado, métricas de la IA y recomendaciones dinámicas.
 */

public record AnalisisOutputDTO(

        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        double probabilidad,

        @JsonProperty("resumen_gastos")
        Map<String, Double> resumenGastos,

        List<String> recomendaciones
) {
}