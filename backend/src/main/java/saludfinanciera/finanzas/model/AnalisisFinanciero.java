package saludfinanciera.finanzas.model; // 1. Paquetes en minúsculas por convención
//Esta entidad representará la tabla principal
// que guardará la cabecera de cada análisis que realice un usuario.

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "analisis_financiero")
@Getter // 2. Usamos Getter y Setter explícitos en vez de @Data
@Setter
@ToString(exclude = {"transacciones", "recomendaciones"}) // 3. Excluimos las colecciones del toString
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 4. Convención CamelCase para atributos de Java
    @Column(name = "ingreso_mensual")
    private double ingresoMensual;

    @Column(name = "nivel_endeudamiento")
    private int nivelEndeudamiento;

    @Column(name = "frecuencia_ahorro")
    private String frecuenciaAhorro;

    @Column(name = "perfil_financiero")
    private String perfilFinanciero;

    @Column(name = "probabilidad_ia")
    private double probabilidadIa;

    @Column(name = "fecha_analisis", nullable = false, updatable = false)
    private LocalDateTime fechaAnalisis = LocalDateTime.now();

    // Relación de Uno a Muchos: Un análisis contiene múltiples transacciones detalladas
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_id")
    private List<Transaccion> transacciones;

    // Guarda la lista de textos de recomendaciones en una tabla secundaria automática
    @ElementCollection
    @CollectionTable(name = "recomendaciones_analisis", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "texto_recomendacion")
    private List<String> recomendaciones;

    // 5. Ciclo de vida de JPA para inicializar la fecha antes de persistir
    @PrePersist
    protected void onCreate() {
        this.fechaAnalisis = LocalDateTime.now();
    }
}