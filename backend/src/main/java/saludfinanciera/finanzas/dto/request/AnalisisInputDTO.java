package saludfinanciera.finanzas.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

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
// 1

        @JsonProperty("ahorro_actual")
        Double ahorroActual,
// 2
        @Schema(
                description = "Porcentaje o puntuación estimada del nivel de endeudamiento (0 a 100)",
                example = "25",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
       // @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @Min(value = 0, message = "El nivel de endeudamiento no puede ser menor a 0")
        @Max(value = 100, message = "El nivel de endeudamiento no puede superar 100")
        @JsonProperty("nivel_endeudamiento")
        Integer nivelEndeudamiento,
// 3

        @Schema(
                description = "Frecuencia con la que el usuario realiza aportes a sus ahorros",
                example = "MENSUAL",
                allowableValues = {"DIARIO", "SEMANAL", "QUINCENAL", "MENSUAL", "OCASIONAL", "NUNCA"},
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @Pattern(
                regexp = "^(DIARIO|SEMANAL|QUINCENAL|MENSUAL|OCASIONAL|NUNCA)$",
                message = "La frecuencia debe ser: DIARIO, SEMANAL, QUINCENAL, MENSUAL, OCASIONAL o NUNCA"
        )
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,
// 4

        @Schema(
                description = "Descripción o motivo del análisis financiero",
                example = "Evaluación de capacidad de ahorro para meta de inversión",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "La descripción no puede estar vacía")
        @JsonProperty("descripcion")
        String descripcion,
// 5
        @Schema(
                description = "Monto objetivo o valor cuantitativo asociado a la meta del análisis",
                example = "150000.00",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El valor es obligatorio")
        @Positive(message = "El valor de la meta debe ser un monto positivo")
        @JsonProperty("valor")
        Double valor,
// 6
        @Schema(
                description = "Listado opcional de transacciones históricas enviadas directamente en la petición JSON",
                nullable = true
        )
        @Valid
        @JsonProperty("historial_transacciones")
        List<@Valid TransaccionItemDTO>historialTransacciones
// 7
){
        // Constructor compacto para normalizar entradas y asegurar listas no nulas
        public AnalisisInputDTO {
                if (frecuenciaAhorro != null) {
                        frecuenciaAhorro = frecuenciaAhorro.trim().toUpperCase();
                }
                if (descripcion != null) {
                        descripcion = descripcion.trim();
                }
                if (historialTransacciones == null) {
                        historialTransacciones = List.of();
                }
        }
}