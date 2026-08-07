package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record RespuestaPythonDTO(

        // Probabilidad/Scoring devuelto por el modelo IA en Python (ej. 0.82)
        @JsonProperty("probabilidad_categoria")
        Double probabilidadCategoria,
        @JsonProperty("probabilidad_perfil-financiero")
        Double probabilidadPerfilFinanciero,
        @JsonProperty("probabilidad_recomendaciones")
        Double probabilidadRecommendaciones,

        // Perfil asignado (ej. "En observación", "SALUDABLE")
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        // MAPA con la clasificación individual de cada gasto: {"almuerzo": "Alimentación", "gasolina": "Transporte"}
        @JsonProperty("categoria")
        Map<String, String> categoria,

        // Lista de sugerencias o consejos generados por la IA
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
) {}