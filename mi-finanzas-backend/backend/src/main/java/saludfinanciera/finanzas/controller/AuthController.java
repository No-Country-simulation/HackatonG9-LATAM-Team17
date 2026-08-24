package saludfinanciera.finanzas.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.request.LoginRequestDTO;
import saludfinanciera.finanzas.dto.request.RegistroRequestDTO;
import saludfinanciera.finanzas.dto.request.ActualizarUsuarioRequestDTO;
import saludfinanciera.finanzas.model.Usuario;
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

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@Valid @RequestBody RegistroRequestDTO request) {
        String mensaje = authService.registrarUsuario(request);
        return ResponseEntity.ok(Map.of("mensaje", mensaje, "status", "success"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUsuario(@Valid @RequestBody LoginRequestDTO request) {
        Usuario usuario = authService.autenticarUsuario(request);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Bienvenido de nuevo, " + usuario.getNombre(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "id", usuario.getId(),
                "token", "fake-jwt-token-for-session",
                "status", "success"
        ));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Object>> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarUsuarioRequestDTO request) {
        Usuario usuario = authService.actualizarUsuario(id, request);
        return ResponseEntity.ok(Map.of(
                "mensaje", "Perfil actualizado correctamente",
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
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