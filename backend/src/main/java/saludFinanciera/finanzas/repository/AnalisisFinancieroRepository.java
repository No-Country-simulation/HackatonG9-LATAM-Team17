package saludFinanciera.finanzas.repository;


import saludFinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalisisFinancieroRepository extends JpaRepository<AnalisisFinanciero, Long> {
    // Al extender de JpaRepository, Spring ya sabe cómo hacer .save(), .findById(), .delete(), etc.
}