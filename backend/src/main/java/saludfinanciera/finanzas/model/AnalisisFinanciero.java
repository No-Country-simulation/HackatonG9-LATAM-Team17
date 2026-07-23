package saludfinanciera.finanzas.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "analisis_financieros")
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioId;
    private String estadoFinanciero; // SALUDABLE / EN_RIESGO

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now()
                .truncatedTo(ChronoUnit.SECONDS);
    }
}