package saludfinanciera.finanzas.dto.response;

import java.util.List;

public record AnalisisOutputDTO(

        String estadoFinanciero, // Ej: "SALUDABLE", "CRÍTICO"

        String diagnostico,     // El texto generado por la IA de Python

        List<String> tips       // Lista de recomendaciones
){
}