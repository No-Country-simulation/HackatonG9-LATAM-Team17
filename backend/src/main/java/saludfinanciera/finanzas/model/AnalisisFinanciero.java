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
@ToString(exclude = {"transacciones", "recomendaciones"}) // Excluimos relaciones para evitar loops infinitos en toString().
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "ingreso_mensual")
    private double ingresoMensual;

    @Column(name = "nivel_endeudamiento")
    private int nivelEndeudamiento;

    @Column(name = "frecuencia_ahorro")
    private String frecuenciaAhorro;

    @Column(name = "perfil_financiero")
    private String perfilFinanciero;

    @Column(name = "probabilidad_ia")
    private double probabilidadIa;

    @Column(name = "fecha_analisis", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaAnalisis;

    // Relación Uno a Muchos: Un análisis tiene muchas transacciones.
    // CascadeType.ALL: Si guardamos o eliminamos el Análisis, sus Transacciones asociadas se guardan/eliminan automáticamente.
    // orphanRemoval = true: Si quitamos una transacción de la lista, Hibernate la borra físicamente de la BD.
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "analisis_id") // Crea una clave foránea (FK) 'analisis_id' en la tabla transacciones.
    @Builder.Default
    private List<Transaccion> transacciones = new ArrayList<>();

    // ElementCollection guarda una lista de elementos simples (String) en una tabla auxiliar.
    @ElementCollection
    @CollectionTable(name = "analisis_categorias", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "categoria")
    @Builder.Default
    private List<String> categoria = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "recomendaciones_analisis", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "texto_recomendacion")
    @Builder.Default
    private List<String> recomendaciones = new ArrayList<>();

    // Callback de JPA que se ejecuta automáticamente JUSTO ANTES de hacer el INSERT en la BD.
    @PrePersist
    protected void prePersist() {
        // Asigna la fecha y hora actual sin milisegundos.
        this.fechaAnalisis = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}