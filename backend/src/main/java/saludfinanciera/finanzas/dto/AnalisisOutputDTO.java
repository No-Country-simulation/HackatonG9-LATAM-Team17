package saludfinanciera.finanzas.dto;

import java.util.List;
import java.util.Map;
/**
 * Molde para el JSON de Salida estructurado que el backend responderá al Frontend.
 * Incluye el perfil financiero calculado, métricas de la IA y recomendaciones dinámicas.
 */

public record AnalisisOutputDTO(
        String perfilFinanciero,
        double probabilidad,
        Map<String, Double> resumenGastos,
        List<String> recomendaciones
) {
}