package saludfinanciera.finanzas.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "transacciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Solo compara por el ID
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private String usuarioId;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "monto",  nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Column(name = "tipo",  nullable = false, length = 10)
    private String tipo; // EGRESO / INGRESO

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "fecha_transaccion", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaTransaccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_id")
    @ToString.Exclude // Previene recursión infinita si usás @ToString
    private AnalisisFinanciero analisis;

    @PrePersist
    public void prePersist() {
        if (this.fechaTransaccion == null) {
            this.fechaTransaccion = LocalDateTime.now()
                    .truncatedTo(ChronoUnit.SECONDS);
        }
    }
}