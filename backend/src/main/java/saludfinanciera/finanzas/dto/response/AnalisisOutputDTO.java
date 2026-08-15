package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Schema(description = "DTO de salida con el resultado del análisis financiero y recomendaciones")
public record AnalisisOutputDTO(

        @Schema(
                description = "Perfil o categoría financiera calculada para el usuario",
                example = "CONSERVADOR",
                allowableValues = {"CONSERVADOR", "MODERADO", "AGRESIVO", "EN_RIESGO"}
        )
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        @Schema(
                description = "Probabilidad o nivel de certeza del análisis asignado (entre 0.0 y 1.0)",
                example = "0.85",
                minimum = "0.0",
                maximum = "1.0"
        )
        @JsonProperty("probabilidad")
        Double probabilidad,

        @Schema(
                description = "Desglose de gastos por categoría en formato clave-valor",
                example = "{\"Alimentación\": 420.0, \"Servicios\": 150.50, \"Entretenimiento\": 80.0}"
        )
        // Map representa un objeto JSON con pares clave-valor (ej. "alimentacion": 420.0)
        @JsonProperty("resumen_gastos")
        Map<String, Double> resumenGastos,

        @Schema(
                description = "Lista de sugerencias y acciones recomendadas según el análisis",
                example = "[\"Reducir gastos en suscripciones no esenciales\", \"Aumentar el fondo de emergencia a 3 meses de ingresos\"]"
        )
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
) {}