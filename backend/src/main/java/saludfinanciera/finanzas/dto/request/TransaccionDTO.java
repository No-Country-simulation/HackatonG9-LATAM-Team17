package saludfinanciera.finanzas.dto.request;
/**
 * Representa cada uno de los gastos individuales que vienen dentro de la lista de entrada.
 */

public record TransaccionDTO(

        String descripcion,

        double valor
) {
}