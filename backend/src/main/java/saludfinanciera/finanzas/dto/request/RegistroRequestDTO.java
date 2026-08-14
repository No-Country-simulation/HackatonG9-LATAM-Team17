package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequestDTO(

        @NotBlank(message = "El nombre es obligatorio")
        @JsonProperty("nombre")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Debe ser un formato de correo válido")
        @JsonProperty("email")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        @JsonProperty("password")
        String password
) {}