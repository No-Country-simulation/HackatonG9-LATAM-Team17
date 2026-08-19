package saludfinanciera.finanzas.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@ToString(exclude = {"transacciones", "recomendaciones", "categorias"})
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AnalisisFinanciero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    // Relación con el usuario (mantenemos JsonIgnore para no exponer los datos sensibles del usuario en el historial)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "perfil_financiero")
    private String perfilFinanciero;

    @Column(name = "fecha_analisis", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaAnalisis;

    // Relación Uno a Muchos con transacciones (Permite serializar sin ignorar)
    @OneToMany(mappedBy = "analisisFinanciero", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference(value = "analisis-transacciones")
    @Builder.Default
    private List<TransaccionAnalisis> transacciones = new ArrayList<>();

    // Relación Uno a Muchos con categorías (Permite serializar sin ignorar)
    @OneToMany(mappedBy = "analisisFinanciero", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference(value = "analisis-categorias")
    @Builder.Default
    private List<CategoriaAnalisis> categorias = new ArrayList<>();

    // Lista de recomendaciones generadas
    @ElementCollection
    @CollectionTable(name = "recomendaciones_analisis", joinColumns = @JoinColumn(name = "analisis_id"))
    @Column(name = "texto_recomendacion", length = 1000)
    @Builder.Default
    private List<String> recomendaciones = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        this.fechaAnalisis = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}