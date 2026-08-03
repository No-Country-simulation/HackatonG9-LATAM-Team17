package saludfinanciera.finanzas.dto.request;

import java.math.BigDecimal;

public record TransaccionItemDTO(
        String fecha,
        String descripcion,
        BigDecimal monto,
        String categoria
) {
}
