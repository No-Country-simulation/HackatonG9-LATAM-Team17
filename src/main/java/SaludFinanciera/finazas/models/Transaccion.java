package SaludFinanciera.finazas.models;
//Esta entidad representará la tabla donde se guardará de forma desagregada
// cada gasto individual enviado, incluyendo el campo especial de categoria_assigned
// que más adelante resolverá la Inteligencia Artificial.

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "transacciones")
@Data
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private double valor;

    // Campo donde guardaremos la categoría identificada ('vivienda', 'ocio', etc.)
    private String categoria_asignada;
}