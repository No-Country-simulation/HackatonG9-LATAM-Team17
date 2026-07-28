package saludfinanciera.finanzas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analisis_financiero")
@Getter // 2. Usamos Getter y Setter explícitos en vez de @Data
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"transacciones", "recomendaciones"}) // 3. Excluimos las colecciones del toString
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
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

    @ElementCollection
    @CollectionTable(name = "analisis_categorias", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "categoria")
    @Builder.Default
    private List<String> categoria = new ArrayList<>();

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