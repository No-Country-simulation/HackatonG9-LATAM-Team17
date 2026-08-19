package saludfinanciera.finanzas.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "categoria_analisis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "analisisFinanciero")
public class CategoriaAnalisis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @JsonBackReference(value = "analisis-categorias")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_financiero_id", nullable = false)
    private AnalisisFinanciero analisisFinanciero;

    @PrePersist
    protected void prePersist() {
        this.fechaRegistro = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}