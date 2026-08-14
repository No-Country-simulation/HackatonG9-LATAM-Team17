package saludfinanciera.finanzas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saludfinanciera.finanzas.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método clave para buscar al usuario por su correo a la hora de hacer el login
    Optional<Usuario> findByEmail(String email);

    // Validar si un correo ya está registrado antes de crearlo
    boolean existsByEmail(String email);
}