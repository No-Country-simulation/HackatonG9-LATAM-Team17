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
// 1
        @Schema(
                description = "Índice o probabilidad estadística calculada por el modelo de IA (0.0 a 1.0)",
                example = "0.85"
        )
        @JsonProperty("probabilidad")
        Double probabilidad,
// 2
        @Schema(
                description = "Mapa de resumen agrupado por categorías de gasto consolidadas en mayúsculas",
                example = "{\"SERVICIOS\": 45000.0, \"ALIMENTACION\": 120000.0, \"OTROS\": 15000.0}"
        )
        @JsonProperty("resumen_gastos")
        Map<String, Object> resumenGastos,
// 3
        @Schema(
                description = "Listado de recomendaciones y sugerencias personalizadas emitidas por la IA",
                example = "[\"Reducir gastos superfluos en la categoría OTROS\", \"Destinar al menos un 10% del ingreso mensual a un fondo de emergencia\"]"
        )
        @JsonProperty("recomendaciones")
        List<String> recomendaciones,
// 4
        @Schema(description = "Monto total gastado procesado por la IA", example = "180000.0")
        @JsonProperty("total_gastado")
        Double totalGastado,
// 5
        @Schema(description = "Capacidad estimada de ahorro mensual", example = "45000.0")
        @JsonProperty("capacidad_ahorro_mensual")
        Double capacidadAhorroMensual,
// 6

        @Schema(description = "Porcentaje o tasa de ahorro del usuario (0-100)", example = "25.0")
        @JsonProperty("porcentaje_tasa_ahorro")
        Double porcentajeTasaAhorro,
// 7
        @Schema(description = "Porcentaje de avance hacia la meta de ahorro (0-100)", example = "60.5")
        @JsonProperty("progreso_meta_ahorro")
        Double progresoMetaAhorro,
// 8
        @Schema(description = "Estimación en meses para alcanzar la meta establecida", example = "12.5")
        @JsonProperty("meses_para_meta")
        Double mesesParaMeta
// 9
){
}