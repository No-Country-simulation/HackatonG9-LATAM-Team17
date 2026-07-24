package saludfinanciera.finanzas.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transacciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Solo compara por el ID
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private String usuarioId;

    private String descripcion;

    private BigDecimal monto;

    private String tipo; // EGRESO / INGRESO

    private String categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_id")
    @ToString.Exclude // Previene recursión infinita si usás @ToString
    private AnalisisFinanciero analisis;
}