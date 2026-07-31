package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransaccionResponseDTO(
        Long id,

        @JsonProperty("usuario_id")
        String usuarioId,

        BigDecimal monto,
        String tipo,
        String descripcion,
        String categoria,

        @JsonProperty("fecha_transaccion")
        LocalDateTime fechaTransaccion
) {
}