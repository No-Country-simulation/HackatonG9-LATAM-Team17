package saludfinanciera.finanzas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saludfinanciera.finanzas.model.AnalisisFinanciero;

@Repository
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {
    Page<AnalisisFinanciero> findByUsuarioIdOrderByFechaAnalisisDesc(Long usuarioId, Pageable pageable);
}