package saludfinanciera.finanzas.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analisis_financiero")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Solo compara por el ID
    private Long id;

    @Column(name = "usuario_id")
    private String usuarioId;

    // --- DATOS FINANCIEROS DE ENTRADA ---
    @Column(name = "ingreso_mensual")
    private Double ingresoMensual;

    @Column(name = "nivel_endeudamiento")
    private Integer nivelEndeudamiento;

    @Column(name = "frecuencia_ahorro")
    private String frecuenciaAhorro;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "valor")
    private Double valor;

    // --- RESPUESTA DE PYTHON / IA ---
    @Column(name = "perfil_financiero")
    private String perfilFinanciero;

    @Column(name = "probabilidad")
    private Double probabilidad;

    // 1. Mapeo de Categorías
    @ElementCollection
    @CollectionTable(name = "analisis_categorias", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "categoria")
    @Builder.Default
    private List<String> categorias = new ArrayList<>();


    // 2. Mapeo de Recomendaciones (¡NUEVO!)
    @ElementCollection
    @CollectionTable(
            name = "analisis_recomendaciones",
            joinColumns = @JoinColumn(name = "analisis_id")
    )
    @Column(name = "recomendacion")
    @Builder.Default
    private List<String> recomendaciones = new ArrayList<>();

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "analisis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Transaccion> transacciones = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        this.fechaCreacion = LocalDateTime.now()
                .truncatedTo(ChronoUnit.SECONDS);
    }
}