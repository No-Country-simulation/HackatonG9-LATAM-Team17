package saludfinanciera.finanzas.dto.request;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record AnalisisCsvParamsDTO(

        @NotNull(message = "El archivo CSV es obligatorio")
        MultipartFile file,

        Double ingresoMensual,
        Double ahorroActual,
        Double metaAhorro,
        Integer nivelEndeudamiento
) {
    // Constructor con valores por defecto para evitar NPF
    public AnalisisCsvParamsDTO {
        if (ingresoMensual == null) ingresoMensual = 0.0;
        if (ahorroActual == null) ahorroActual = 0.0;
        if (metaAhorro == null) metaAhorro = 0.0;
        if (nivelEndeudamiento == null) nivelEndeudamiento = 0;
    }
}
