package saludfinanciera.finanzas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saludfinanciera.finanzas.model.AnalisisFinanciero;

import java.util.List;

@Repository
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {

    // Método clave para que el historial busque los análisis del usuario logueado
    List<AnalisisFinanciero> findByUsuarioIdOrderByFechaAnalisisDesc(Long usuarioId);
}