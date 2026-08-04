package saludfinanciera.finanzas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record RespuestaPythonDTO(

        // Probabilidad/Scoring devuelto por el modelo IA en Python (ej. 0.82)
        @JsonProperty("probabilidad")
        Double probabilidad,

        // Perfil asignado (ej. "En observación", "SALUDABLE")
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        // MAPA con la clasificación individual de cada gasto: {"almuerzo": "Alimentación", "gasolina": "Transporte"}
        @JsonProperty("clasificacion_gastos")
        Map<String, String> categoria,

        // Lista de sugerencias o consejos generados por la IA
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
) {}