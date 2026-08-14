package saludfinanciera.finanzas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.dto.request.LoginRequestDTO;
import saludfinanciera.finanzas.dto.request.RegistroRequestDTO;
import saludfinanciera.finanzas.model.Usuario;
import saludfinanciera.finanzas.repository.UsuarioRepository;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyectamos el repositorio y el encriptador de contraseñas
    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registrarUsuario(RegistroRequestDTO request) {
        // 1. Validar si el correo ya está registrado
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("El correo electrónico ya está en uso.");
        }

        // 2. Crear la entidad Usuario
        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.nombre())
                .email(request.email())
                .password(passwordEncoder.encode(request.password())) // ¡Contraseña cifrada con BCrypt!
                .build();

        // 3. Guardar en la base de datos de PostgreSQL
        usuarioRepository.save(nuevoUsuario);

        return "Usuario registrado exitosamente";
    }
    public String autenticarUsuario(LoginRequestDTO request) {
        // 1. Buscar al usuario por correo en PostgreSQL
        var usuarioOpt = usuarioRepository.findByEmail(request.email());

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        }

        var usuario = usuarioOpt.get();

        // 2. Verificar si la contraseña coincide con el hash almacenado
        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        }

        return "Bienvenido de nuevo, " + usuario.getNombre();
    }
    public boolean eliminarPorEmail(String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent()) {
            usuarioRepository.delete(usuario.get());
            return true;
        }
        return false;
    }
}