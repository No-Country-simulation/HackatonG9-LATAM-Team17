package saludfinanciera.finanzas.controller;

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
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para registrar un nuevo usuario en la base de datos.
     * Ruta: POST http://localhost:8080/api/v1/auth/registro
     */
    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(@Valid @RequestBody RegistroRequestDTO request) {
        String mensaje = authService.registrarUsuario(request);
        return ResponseEntity.ok(mensaje);
    }
    @PostMapping("/login")
    public ResponseEntity<String> loginUsuario(@Valid @RequestBody LoginRequestDTO request) {
        String mensaje = authService.autenticarUsuario(request);
        return ResponseEntity.ok(mensaje);
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