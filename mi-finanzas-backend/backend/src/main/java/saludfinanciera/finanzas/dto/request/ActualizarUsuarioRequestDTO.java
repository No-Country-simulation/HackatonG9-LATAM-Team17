package saludfinanciera.finanzas.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import saludfinanciera.finanzas.validation.AlMenosUnCampoPresente;

@AlMenosUnCampoPresente
public record ActualizarUsuarioRequestDTO(
        @Size(min = 1, message = "El nombre no puede estar vacío")
        String nombre,

        @Email(message = "Debe ser un formato de correo válido")
        String email
) {}