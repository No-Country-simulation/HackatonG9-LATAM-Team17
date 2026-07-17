package SaludFinanciera.finazas.models;
//Esta entidad representará la tabla principal
// que guardará la cabecera de cada análisis que realice un usuario.

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "analisis_financiero")
@Data
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double ingreso_mensual;
    private int nivel_endeudamiento;
    private String frecuencia_ahorro;
    private String perfil_financiero;
    private double probabilidad_ia;

    // Registra automáticamente el día y la hora exacta en que el usuario hizo la consulta
    private LocalDateTime fecha_analisis = LocalDateTime.now();

    // Relación de Uno a Muchos: Un análisis contiene múltiples transacciones detalladas
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_id")
    private List<Transaccion> transacciones;

    // Guarda la lista de textos de recomendaciones en una tabla secundaria automática
    @ElementCollection
    @CollectionTable(name = "recomendaciones_analisis", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "texto_recomendacion")
    private List<String> recomendaciones;
}