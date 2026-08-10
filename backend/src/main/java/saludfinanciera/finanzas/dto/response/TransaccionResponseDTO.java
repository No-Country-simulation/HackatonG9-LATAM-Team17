package saludfinanciera.finanzas.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Respuesta detallada de una transacción registrada en el sistema")
public record TransaccionResponseDTO(

        @Schema(description = "Identificador único de la transacción en PostgreSQL", example = "2")
        @JsonProperty("id")
        Long id,
// 1
        @Schema(description = "Identificador del usuario asociado", example = "USR-DEFAULT")
        @JsonProperty("usuario_id")
        String usuarioId,
// 2
        @Schema(description = "Monto asignado al movimiento", example = "50000.00")
        @JsonProperty("monto")
        BigDecimal monto,
// 3
        @Schema(description = "Tipo de transacción", example = "INGRESO")
        @JsonProperty("tipo")
        String tipo,
// 4
        @Schema(description = "Descripción original del registro", example = "Cobro por Hackathon")
        @JsonProperty("descripcion")
        String descripcion,
// 5
        @Schema(description = "Categoría normalizada en mayúsculas (asignada manualmente o por Python NLP)", example = "SERVICIOS")
        @JsonProperty("categoria")
        String categoria,
// 6
        @Schema(description = "Fecha y hora exacta del registro",
                example = "2026-08-04T12:08:32"
        )
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        @JsonProperty("fecha_transaccion")
        LocalDateTime fechaTransaccion,
// 7
        @Schema(description = "ID del análisis financiero asociado, si aplica", example = "1", nullable = true)
        @JsonProperty("analisis_id")
        Long analisisId // Agregamos el ID del Análisis o un DTO liviano
// 8
) {
}