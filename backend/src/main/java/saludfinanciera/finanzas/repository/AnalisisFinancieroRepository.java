package saludfinanciera.finanzas.repository;

import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Indica que es un componente de acceso a datos de Spring.
// Extendemos JpaRepository<Entidad, TipoID> para obtener gratis métodos CRUD (save, findById, delete, etc.).
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {
}