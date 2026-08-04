package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Schema(description = "Respuesta consolidada con el diagnóstico del perfil financiero, métricas de modelo y recomendaciones generadas por la IA")
public record AnalisisOutputDTO(

        @Schema(
                description = "Perfil o nivel de riesgo financiero determinado por el microservicio NLP",
                example = "Moderado"
        )
        @JsonProperty("perfil_financiero")
        String perfilFinanciero,

        @Schema(
                description = "Índice o probabilidad estadística calculada por el modelo de IA (0.0 a 1.0)",
                example = "0.85"
        )
        @JsonProperty("probabilidad")
        Double probabilidad,

        @Schema(
                description = "Mapa de resumen agrupado por categorías de gasto consolidadas en mayúsculas",
                example = "{\"SERVICIOS\": 45000.0, \"ALIMENTACION\": 120000.0, \"OTROS\": 15000.0}"
        )
        @JsonProperty("resumen_gastos")
        Map<String, Object> resumenGastos,

        @Schema(
                description = "Listado de recomendaciones y sugerencias personalizadas emitidas por la IA",
                example = "[\"Reducir gastos superfluos en la categoría OTROS\", \"Destinar al menos un 10% del ingreso mensual a un fondo de emergencia\"]"
        )
        @JsonProperty("recomendaciones")
        List<String> recomendaciones
){
}