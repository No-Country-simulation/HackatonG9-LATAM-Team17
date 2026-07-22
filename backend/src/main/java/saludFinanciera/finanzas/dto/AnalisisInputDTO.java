package saludFinanciera.finanzas.dto;

/**
 * Molde exacto para el JSON de Entrada que el Frontend enviará al presionar "Analizar".
 * Usamos Record para asegurar la inmutabilidad de los datos de transferencia.
 */

import java.util.List;


public record AnalisisInputDTO(
        double ingresoMensual,
        int nivelEndeudamiento,
        String frecuenciaAhorro,
        List<TransaccionDTO> transacciones
) {
}