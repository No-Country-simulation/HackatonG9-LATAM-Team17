package saludfinanciera.finanzas.dto.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AnalisisInputDTO(

        @NotBlank(message = "El ID del usuario es obligatorio")
        String usuarioId,

        @NotEmpty(message = "La lista de transacciones no puede estar vacía")
        @Valid // ¡Súper importante para que valide los @NotBlank y @Positive dentro de TransaccionDTO!
        List<TransaccionDTO> transacciones
){
}