package saludfinanciera.finanzas.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "Parámetros de entrada para el procesamiento y análisis masivo de transacciones desde un archivo CSV")
public record AnalisisCsvParamsDTO(

        @Schema(
                description = "Archivo CSV que contiene el historial de transacciones",
                requiredMode = Schema.RequiredMode.REQUIRED,
                type = "string",
                format = "binary"
        )
        @NotNull(message = "El archivo CSV es obligatorio")
        MultipartFile file,
// 1
        @Schema(
                description = "Ingreso mensual del usuario",
                example = "650000.00",
                defaultValue = "0.0"
        )
        Double ingresoMensual,
// 2
        @Schema(
                description = "Monto de ahorro acumulado a la fecha",
                example = "150000.00",
                defaultValue = "0.0"
        )
        Double ahorroActual,
// 3
        @Schema(
                description = "Meta de ahorro definida por el usuario",
                example = "300000.00",
                defaultValue = "0.0"
        )
        Double metaAhorro,
// 4
        @Schema(
                description = "Nivel de endeudamiento (0-4). Si se omite o es null, la IA lo calculará automáticamente según las transacciones",
                example = "1",
                defaultValue = "0",
                allowableValues = {"0", "1", "2", "3", "4"}
        )
        Integer nivelEndeudamiento
// 5
) {
    // Constructor con valores por defecto para evitar NPF
    public AnalisisCsvParamsDTO {
        if (ingresoMensual == null) ingresoMensual = 0.0;
        if (ahorroActual == null) ahorroActual = 0.0;
        if (metaAhorro == null) metaAhorro = 0.0;
        if (nivelEndeudamiento == null) nivelEndeudamiento = 0;
    }
}