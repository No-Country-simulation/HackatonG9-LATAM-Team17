package saludfinanciera.finanzas.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.request.LoginRequestDTO;
import saludfinanciera.finanzas.dto.request.RegistroRequestDTO;
import saludfinanciera.finanzas.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // Permite la conexión con tu frontend
@Tag(name = "Autenticación", description = "Endpoints para registro, inicio de sesión y gestión de cuentas de usuario")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para registrar un nuevo usuario en la base de datos.
     * Ruta: POST http://localhost:8080/api/v1/auth/registro
     */
    @Operation(
            summary = "Registrar nuevo usuario",
            description = "Crea un nuevo registro de usuario en el sistema con sus credenciales iniciales."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Usuario registrado correctamente",
            content = @Content(
                    mediaType = "text/plain",
                    schema = @Schema(type = "string", example = "Usuario registrado exitosamente")
            )
    )
    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos requeridos para el registro del usuario",
                    required = true,
                    content = @Content(schema = @Schema(implementation = RegistroRequestDTO.class))
            )
            @Valid @RequestBody RegistroRequestDTO request) {
        String mensaje = authService.registrarUsuario(request);
        return ResponseEntity.ok(mensaje);
    }

    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica al usuario en el sistema mediante email y contraseña."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Autenticación exitosa",
            content = @Content(
                    mediaType = "text/plain",
                    schema = @Schema(type = "string", example = "Autenticación exitosa")
            )
    )
    @PostMapping("/login")
    public ResponseEntity<String> loginUsuario(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Credenciales de acceso del usuario",
                    required = true,
                    content = @Content(schema = @Schema(implementation = LoginRequestDTO.class))
            )
            @Valid @RequestBody LoginRequestDTO request) {
        String mensaje = authService.autenticarUsuario(request);
        return ResponseEntity.ok(mensaje);
    }

    @Operation(
            summary = "Eliminar cuenta de usuario",
            description = "Elimina la cuenta del usuario de la base de datos utilizando su dirección de correo."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Cuenta eliminada correctamente",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(example = "{\"mensaje\": \"Cuenta eliminada correctamente\"}")
            )
    )
    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarCuenta(
            @Parameter(
                    description = "Dirección de correo electrónico asociada a la cuenta que se desea eliminar",
                    required = true,
                    example = "juan.perez@ejemplo.com"
            )
            @RequestParam String email) {
        boolean eliminado = authService.eliminarPorEmail(email);
        if (eliminado) {
            return ResponseEntity.ok(Map.of("mensaje", "Cuenta eliminada correctamente"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
    }
}