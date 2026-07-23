package saludfinanciera.finanzas.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String usuarioId;

    private String descripcion;

    private BigDecimal monto;

    private String tipo; // EGRESO / INGRESO

    private String categoria;
}