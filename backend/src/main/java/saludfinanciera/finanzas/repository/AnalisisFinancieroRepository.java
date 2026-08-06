package saludfinanciera.finanzas.repository;


import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {

    // Consulta derivada para obtener todos los análisis de un usuario
    List<AnalisisFinanciero> findByUsuarioId(String usuarioId);

}