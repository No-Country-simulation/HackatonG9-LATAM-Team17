package SaludFinanciera.finazas.DTOs;
//Este es el molde exacto para el JSON de Entrada
// que el Frontend enviará cuando el usuario presione "Analizar"

import lombok.Data;
import java.util.List;

@Data
public class AnalisisInputDTO {
    private double ingreso_mensual;
    private int nivel_endeudamiento;
    private String frecuencia_ahorro;
    private List<TransaccionDTO> transacciones;
}