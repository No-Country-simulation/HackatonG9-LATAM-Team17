package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Schema(description = "DTO de respuesta recibido desde el servicio de IA en Python con métricas y predicciones")
public record RespuestaPythonDTO(


        @Schema(
                description = "Nivel de confianza o probabilidad en la categorización de los datos (0.0 a 1.0)",
                example = "0.92",
                minimum = "0.0",
                maximum = "1.0"
        )
        // Probabilidades devueltas por los modelos de IA en Python
        @JsonProperty("probabilidad_categoria")
        Double probabilidadCategoria,

        @Schema(
                description = "Nivel de confianza de la predicción del perfil financiero (0.0 a 1.0)",
                example = "0.88",
                minimum = "0.0",
                maximum = "1.0"
        )
        @JsonProperty("probabilidad_perfil_financiero")
        Double probabilidadPerfilFinanciero,

        @Schema(
                description = "Nivel de confianza en las recomendaciones generadas por el modelo (0.0 a 1.0)",
                example = "0.95",
                minimum = "0.0",
                maximum = "1.0"
        )
        @JsonProperty("probabilidad_recomendaciones")
        Double probabilidadRecomendaciones,


        @Schema(
                description = "Perfil financiero calculado por los modelos de IA",
                example = "Estable",
                allowableValues = {"Estable", "En riesgo", "Conservador", "Moderado", "Agresivo"}
        )
        // Perfil asignado (ej. "Estable", "En riesgo")
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,


        @Schema(
                description = "Resumen acumulado de gastos clasificados por categoría",
                example = "{\"Transporte\": 200.0, \"Alimentación\": 20.0, \"Servicios\": 150.0}"
        )
        // MAPA con el resumen acumulado de gastos por categoría: {"Transporte": 200.0, "Alimentación": 20.0}
        @JsonProperty("resumen_gastos")
        Map<String, Double> resumenGastos,

        @Schema(
                description = "Lista de sugerencias y consejos personalizados generados por la IA",
                example = "[\"Reducir el gasto en transporte diario\", \"Mantener el hábito de ahorro\"]"
        )
        // Lista de sugerencias o consejos generados por la IA
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
) {}