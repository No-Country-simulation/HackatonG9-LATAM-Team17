package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

public record AnalisisInputDTO(

        @NotNull(message = "El ingreso mensual es obligatorio")
        @Positive(message = "El ingreso mensual debe ser un valor positivo")
        @JsonProperty("ingreso_mensual")
        Double ingresoMensual,

        @NotNull(message = "El nivel de endeudamiento es obligatorio")
        @JsonProperty("nivel_endeudamiento")
        Integer nivelEndeudamiento,

        @NotNull(message = "La frecuencia de ahorro es obligatoria")
        @JsonProperty("frecuencia_ahorro")
        String frecuenciaAhorro,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("monto_inversion")
        Double montoInversion,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("deuda_total")
        Double deudaTotal,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("objetivo_presupuesto")
        Double objetivoPresupuesto,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("pago_mensual_deuda")
        Double pagoMensualDeuda,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero sin decimales")
        @JsonProperty("servicios_suscripción")
        Integer serviciosSuscripcion,

        @NotNull(message = "El monto no puede ser nulo")
        @PositiveOrZero(message = "El monto debe ser un valor positivo igual o mayor a cero")
        @JsonProperty("fondo_emergencia")
        Double fondoEmergencia,

        @Valid
        @JsonProperty("transacciones")
        List<TransaccionDTO> transacciones
) {}