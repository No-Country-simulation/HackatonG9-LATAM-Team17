package saludfinanciera.finanzas.dto.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import saludfinanciera.finanzas.dto.TransaccionDTO;

import java.util.List;

@Data
public class AnalisisInputDTO{

    @NotBlank(message = "El usuarioId es obligatorio")
    private String usuarioId;

    @NotEmpty(message = "La lista de transacciones no puede estar vacía")
    @Valid // <-- Permite validar las anotaciones internas de TransaccionDTO
    private List<TransaccionDTO> transacciones;
}