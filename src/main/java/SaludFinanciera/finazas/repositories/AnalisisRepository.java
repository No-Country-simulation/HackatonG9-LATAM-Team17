package SaludFinanciera.finazas.repositories;


import SaludFinanciera.finazas.models.AnalisisFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalisisRepository extends JpaRepository<AnalisisFinanciero, Long> {
    // Al extender de JpaRepository, Spring ya sabe cómo hacer .save(), .findById(), .delete(), etc.
}