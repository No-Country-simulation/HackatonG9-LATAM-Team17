package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

@Schema(description = "DTO de entrada con los datos financieros y transacciones del usuario para procesar el análisis")
public record AnalisisInputDTO(

        @Schema(
                description = "Ingreso mensual bruto del usuario",
                example = "350000.50",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.01"
        )
        @NotNull(message = "El ingreso mensual es obligatorio")
        @Positive(message = "El ingreso mensual debe ser un valor positivo")
        @JsonProperty("ingreso_mensual")
        Double ingresoMensual,

        @Schema(
                description = "Nivel de endeudamiento estimado del usuario (porcentaje o escala)",
                example = "30",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @JsonProperty("nivel_endeudamiento")
        Integer nivelEndeudamiento,

        @Schema(
                description = "Frecuencia con la que el usuario realiza ahorros",
                example = "MENSUAL",
                allowableValues = {"SEMANAL", "QUINCENAL", "MENSUAL", "OCASIONAL", "NUNCA"},
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,

        @Schema(
                description = "Monto destinado actualmente a inversiones",
                example = "50000.00",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("monto_inversion")
        Double montoInversion,

        @Schema(
                description = "Monto acumulado de deuda total activa",
                example = "120000.00",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("deuda_total")
        Double deudaTotal,

        @Schema(
                description = "Meta u objetivo monetario del presupuesto",
                example = "200000.00",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("objetivo_presupuesto")
        Double objetivoPresupuesto,

        @Schema(
                description = "Pago mensual destinado al servicio de la deuda",
                example = "15000.00",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("pago_mensual_deuda")
        Double pagoMensualDeuda,

        @Schema(
                description = "Cantidad total de servicios de suscripción activos (ej. Netflix, Spotify)",
                example = "4",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero sin decimales")
        @JsonProperty("servicios_suscripción")
        Integer serviciosSuscripcion,

        @Schema(
                description = "Monto reservado actualmente en la cuenta para fondo de emergencia",
                example = "100000.00",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minimum = "0.0"
        )
        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("fondo_emergencia")
        Double fondoEmergencia,

        @Schema(
                description = "Lista detallada de transacciones financieras para evaluar en el análisis",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @Valid
        @JsonProperty("transacciones")
        List<TransaccionDTO> transacciones
) {}