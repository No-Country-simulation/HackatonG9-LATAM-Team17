package saludfinanciera.finanzas.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- Asegúrate de importar esto
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones_analisis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "analisisFinanciero")
public class TransaccionAnalisis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Double valor;

    @Column(name = "fecha_transaccion")
    private LocalDateTime fechaTransaccion;

    @JsonIgnore // <--- AÑADE ESTO AQUÍ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analisis_financiero_id", nullable = false)
    private AnalisisFinanciero analisisFinanciero;
}