package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record RespuestaPythonDTO(

        // Probabilidades devueltas por los modelos de IA en Python
        @JsonProperty("probabilidad_categoria")
        Double probabilidadCategoria,
        @JsonProperty("probabilidad_perfil_financiero")
        Double probabilidadPerfilFinanciero,
        @JsonProperty("probabilidad_recomendaciones")
        Double probabilidadRecomendaciones,

        // Perfil asignado (ej. "Estable", "En riesgo")
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        // MAPA con el resumen acumulado de gastos por categoría: {"Transporte": 200.0, "Alimentación": 20.0}
        @JsonProperty("resumen_gastos")
        Map<String, Double> resumenGastos,

        // Lista de sugerencias o consejos generados por la IA
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
) {}