package saludfinanciera.finanzas.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;


@Schema(description = "Estructura de entrada con datos socioeconómicos e historial de transacciones para el análisis de salud financiera")
public record AnalisisInputDTO(


        @Schema(
                description = "Ingreso mensual promedio del usuario",
                example = "450000.50",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El ingreso mensual es obligatorio")
        @Positive(message = "El ingreso mensual debe ser un valor positivo")
        @JsonProperty("ingreso_mensual")
        Double ingresoMensual,


        @Schema(
                description = "Porcentaje o puntuación estimada del nivel de endeudamiento (0 a 100)",
                example = "25",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @JsonProperty("nivel_endeudamiento")
        Integer nivelEndeudamiento,


        @Schema(
                description = "Frecuencia con la que el usuario realiza aportes a sus ahorros",
                example = "MENSUAL",
                allowableValues = {"DIARIO", "SEMANAL", "QUINCENAL", "MENSUAL", "OCASIONAL", "NUNCA"},
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,


        @Schema(
                description = "Descripción o motivo del análisis financiero",
                example = "Evaluación de capacidad de ahorro para meta de inversión",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull
        @JsonProperty("descripcion")
        String descripcion,

        @Schema(
                description = "Monto objetivo o valor cuantitativo asociado a la meta del análisis",
                example = "150000.00",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El valor es obligatorio")
        @Positive
        @JsonProperty("valor")
        Double valor,

        @Schema(
                description = "Listado opcional de transacciones históricas enviadas directamente en la petición JSON",
                nullable = true
        )
        @JsonProperty("historial_transacciones")
        List<@Valid TransaccionItemDTO>historialTransacciones
){
}