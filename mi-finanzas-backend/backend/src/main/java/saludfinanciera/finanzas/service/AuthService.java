package saludfinanciera.finanzas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.dto.request.LoginRequestDTO;
import saludfinanciera.finanzas.dto.request.RegistroRequestDTO;
import saludfinanciera.finanzas.dto.request.ActualizarUsuarioRequestDTO;
import saludfinanciera.finanzas.exception.AuthenticationFailedException;
import saludfinanciera.finanzas.exception.EntityAlreadyExistsException;
import saludfinanciera.finanzas.exception.ResourceNotFoundException;
import saludfinanciera.finanzas.model.Usuario;
import saludfinanciera.finanzas.repository.UsuarioRepository;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registrarUsuario(RegistroRequestDTO request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EntityAlreadyExistsException("El correo electrónico ya está en uso.");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.nombre())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        usuarioRepository.save(nuevoUsuario);
        return "Usuario registrado exitosamente";
    }

    public Usuario autenticarUsuario(LoginRequestDTO request) {
        var usuarioOpt = usuarioRepository.findByEmail(request.email());

        if (usuarioOpt.isEmpty()) {
            throw new AuthenticationFailedException("Usuario o contraseña incorrectos.");
        }

        var usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new AuthenticationFailedException("Usuario o contraseña incorrectos.");
        }

        return usuario;
    }

    public boolean eliminarPorEmail(String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent()) {
            usuarioRepository.delete(usuario.get());
            return true;
        }
        return false;
    }

    public Usuario actualizarUsuario(Long id, ActualizarUsuarioRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        if (request.nombre() != null && !request.nombre().isBlank()) {
            usuario.setNombre(request.nombre());
        }

        if (request.email() != null && !request.email().isBlank()) {
            if (usuarioRepository.existsByEmailAndIdNot(request.email(), id)) {
                throw new EntityAlreadyExistsException("El correo electrónico ya está en uso por otro usuario.");
            }
            usuario.setEmail(request.email());
        }

        return usuarioRepository.save(usuario);
    }
}