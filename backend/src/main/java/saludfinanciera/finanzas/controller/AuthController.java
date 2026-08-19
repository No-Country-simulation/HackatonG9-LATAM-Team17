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
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Endpoints para registro, inicio de sesión y gestión de cuentas de usuario")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
            summary = "Registrar nuevo usuario",
            description = "Crea un nuevo registro de usuario en el sistema con sus credenciales iniciales."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Usuario registrado correctamente",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(example = "{\"mensaje\": \"Usuario registrado exitosamente\"}")
            )
    )
    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(
            @Valid @RequestBody RegistroRequestDTO request) {
        String mensaje = authService.registrarUsuario(request);
        return ResponseEntity.ok(Map.of(
                "mensaje", mensaje,
                "status", "success"
        ));
    }

    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica al usuario en el sistema mediante email y contraseña."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Autenticación exitosa",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(example = "{\"mensaje\": \"Bienvenido de nuevo\", \"token\": \"mock-token\", \"status\": \"success\"}")
            )
    )
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUsuario(
            @Valid @RequestBody LoginRequestDTO request) {

        String mensaje = authService.autenticarUsuario(request);

        // Devolvemos el mensaje, el email, un ID simulado y un token falso
        // para que cualquier validación que haga el frontend de JS pase sin rechazarlo.
        return ResponseEntity.ok(Map.of(
                "mensaje", mensaje,
                "email", request.email(),
                "id", 1,
                "token", "fake-jwt-token-for-session",
                "status", "success"
        ));
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarCuenta(@RequestParam String email) {
        boolean eliminado = authService.eliminarPorEmail(email);
        if (eliminado) {
            return ResponseEntity.ok(Map.of("mensaje", "Cuenta eliminada correctamente"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
    }
}