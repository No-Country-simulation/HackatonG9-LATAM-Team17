package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "DTO para la solicitud de autenticación de usuario")
public record LoginRequestDTO(

        @Schema(
                description = "Correo electrónico registrado del usuario",
                example = "usuario@ejemplo.com",
                requiredMode = Schema.RequiredMode.REQUIRED,
                format = "email"
        )
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Formato de correo inválido")
        @JsonProperty("email")
        String email,

        @Schema(
                description = "Contraseña de la cuenta del usuario",
                example = "Password123!",
                requiredMode = Schema.RequiredMode.REQUIRED,
                format = "password"
        )
        @NotBlank(message = "La contraseña es obligatoria")
        @JsonProperty("password")
        String password
) {}