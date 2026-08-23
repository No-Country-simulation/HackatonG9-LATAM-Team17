package saludfinanciera.finanzas.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.response.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PythonDataScienceClient {

    private final RestClient pythonRestClient;

    public PythonDataScienceClient(
            RestClient.Builder restClientBuilder,
            @Value("${python.nlp.service.url:http://localhost:8000}") String pythonRestClientUrl
    ) {
        this.pythonRestClient = restClientBuilder
                .baseUrl(pythonRestClientUrl)
                .build();
    }

    // --- CONSUMO ITEM 1: Análisis General ---
    public RespuestaPythonDTO obtenerAnalisisDesdePython(AnalisisInputDTO inputDTO) {
        try {
            return pythonRestClient.post()
                    .uri("/api/v1/analizar-perfil")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(inputDTO)
                    .retrieve()
                    .body(RespuestaPythonDTO.class);

        } catch (Exception e) {
            System.out.println("⚠️ Error conectando con Python (/analizar-perfil): " + e.getMessage());

            // CORREGIDO: Mapa de respaldo con acumulados numéricos (Double)
            Map<String, Double> mapaFallback = new HashMap<>();
            mapaFallback.put("Alimentación", 150.0);
            mapaFallback.put("Transporte", 50.0);

            return new RespuestaPythonDTO(
                    0.75, // probabilidadCategoria
                    0.75, // probabilidadPerfilFinanciero
                    0.75, // probabilidadRecomendaciones
                    "Estable",
                    mapaFallback,
                    List.of(
                            "Servicio de IA no disponible temporalmente.",
                            "Revisa tus gastos recurrentes manualmente."
                    )
            );
        }
    }

    // --- CONSUMO ITEM 2: Clasificación de Transacción Individual ---
    public RespuestaPythonDTO obtenerClasificacionDesdePython(TransaccionDTO transaccionDTO) {
        try {
            return pythonRestClient.post()
                    .uri("/api/v1/clasificar-transaccion")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(transaccionDTO)
                    .retrieve()
                    .body(RespuestaPythonDTO.class);

        } catch (Exception e) {
            System.out.println("⚠️ Error conectando con Python (/clasificar-transaccion): " + e.getMessage());

            // Obtenemos el valor de la transacción si existe para usarlo en el respaldo
            double valorTransaccion = (transaccionDTO != null) ? transaccionDTO.valor() : 0.0;

            // CORREGIDO: Mapa de respaldo individual con tipo Double
            Map<String, Double> mapaFallbackIndividual = new HashMap<>();
            mapaFallbackIndividual.put("Ocio", valorTransaccion);

            return new RespuestaPythonDTO(
                    0.0, // probabilidadCategoria
                    0.0, // probabilidadPerfilFinanciero
                    0.0, // probabilidadRecomendaciones
                    "Estable",
                    mapaFallbackIndividual,
                    List.of("No fue posible obtener recomendaciones para esta transacción.")
            );
        }
    }
}