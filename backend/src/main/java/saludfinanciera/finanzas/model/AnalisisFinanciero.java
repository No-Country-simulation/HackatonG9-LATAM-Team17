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

    private String usuarioId;
    private String estadoFinanciero; // SALUDABLE / EN_RIESGO

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;


    @OneToMany(mappedBy = "analisis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Transaccion> transacciones = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now()
                .truncatedTo(ChronoUnit.SECONDS);
    }
}