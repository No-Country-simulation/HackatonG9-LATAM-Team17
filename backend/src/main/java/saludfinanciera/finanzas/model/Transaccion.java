package saludfinanciera.finanzas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity // Marca la clase como una entidad gestionada por JPA / Hibernate.
@Table(name = "transacciones") // Define el nombre exacto de la tabla en la BD.
@Getter // Lombok: genera getters para todos los campos.
@Setter // Lombok: genera setters para todos los campos.
@NoArgsConstructor // Lombok: genera un constructor vacío requerido por JPA.
@AllArgsConstructor // Lombok: genera un constructor con todos los argumentos.
@Builder // Lombok: implementa el patrón de diseño Builder para construir objetos limpiamente.
@ToString
public class Transaccion {

    @Id // Marca este campo como la Llave Primaria (PK).
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment en PostgreSQL/MySQL.
    private Long id;

    @Column(nullable = false) // Restricción NOT NULL en BD.
    private String descripcion;

    @Column(nullable = false)
    private double valor;

    @Column(name = "categoria_asignada") // Mapea con la columna 'categoria_asignada'.
    private String categoriaAsignada;
}