package saludFinanciera.finanzas.model;
//Esta entidad representará la tabla donde se guardará de forma desagregada
// cada gasto individual enviado, incluyendo el campo especial de categoria_assigned
// que más adelante resolverá la Inteligencia Artificial.

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "transacciones")
@Getter
@Setter
@ToString
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private double valor;

    // Ajustado a camelCase en Java y mapeado a snake_case para la base de datos
    @Column(name = "categoria_asignada")
    private String categoriaAsignada;
}