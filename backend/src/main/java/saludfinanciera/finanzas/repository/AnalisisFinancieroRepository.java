package saludfinanciera.finanzas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.model.AnalisisFinanciero;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {

    // 1. Buscar el historial de un usuario ordenado del más reciente al más antiguo
    List<AnalisisFinanciero> findByUsuarioIdOrderByFechaAnalisisDesc(Long usuarioId);

    // 2. Borrar los análisis de un usuario que sean anteriores a una fecha de corte (ej. hace 3 meses)
    @Modifying
    @Transactional
    @Query("DELETE FROM AnalisisFinanciero a WHERE a.usuario.id = :usuarioId AND a.fechaAnalisis < :fechaCorte")
    void borrarAnalisisAntiguos(@Param("usuarioId") Long usuarioId, @Param("fechaCorte") LocalDateTime fechaCorte);
}