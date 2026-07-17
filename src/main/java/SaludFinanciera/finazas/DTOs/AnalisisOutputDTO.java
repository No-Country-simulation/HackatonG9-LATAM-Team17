package SaludFinanciera.finazas.DTOs;
//Este es el molde para el JSON de Salida estructurado que tu backend le
// responderá al Frontend, incluyendo el perfil calculado y las recomendaciones dinámicas.

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AnalisisOutputDTO {
    private String perfil_financiero;
    private double probabilidad;
    private Map<String, Double> resumen_gastos;
    private List<String> recomendaciones;
}