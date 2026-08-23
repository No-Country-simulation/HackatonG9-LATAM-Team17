package saludfinanciera.finanzas.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para la solicitud de registro de un nuevo usuario")
public record RegistroRequestDTO(

        @Schema(
                description = "Nombre completo del usuario",
                example = "Juan Pérez",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "El nombre es obligatorio")
        @JsonProperty("nombre")
        String nombre,

        @Schema(
                description = "Correo electrónico para el registro de la cuenta",
                example = "juan.perez@ejemplo.com",
                requiredMode = Schema.RequiredMode.REQUIRED,
                format = "email"
        )
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Debe ser un formato de correo válido")
        @JsonProperty("email")
        String email,

        @Schema(
                description = "Contraseña segura para la cuenta (mínimo 6 caracteres)",
                example = "Secret123!",
                requiredMode = Schema.RequiredMode.REQUIRED,
                minLength = 6,
                format = "password"
        )
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        @JsonProperty("password")
        String password
) {}