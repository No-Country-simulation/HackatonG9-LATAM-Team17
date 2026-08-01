package saludfinanciera.finanzas.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;

import java.util.List;
import java.util.Map;

@Component
public class NlpDataClient {

    private final RestClient nlpRestClient;

    public NlpDataClient(
            RestClient.Builder restClientBuilder,
            @Value("${python.nlp.service.url}") String nlpServiceUrl
    ) {
        this.nlpRestClient = restClientBuilder
                .baseUrl(nlpServiceUrl)
                .build();
    }

    public AnalisisOutputDTO analizarPerfil(AnalisisInputDTO inputDTO) {
        try {
            // Intenta llamar al microservicio de Python NLP
            return nlpRestClient.post()
                    .uri("/api/v1/analizar-perfil") // O /categorizar según el caso
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(inputDTO)
                    .retrieve()
                    .body(AnalisisOutputDTO.class);
        } catch (Exception e) {
            //  AGREGA ESTAS LÍNEAS PARA VER EL ERROR REAL EN LA CONSOLA
            System.err.println("❌ ERROR EN CLIENTE REST DE PYTHON NLP:");
            e.printStackTrace();
            // FALLBACK TEMPORAL: Si Python no responde o no está disponible,
            // devolvemos un objeto Mock para no cortar el flujo de Spring Boot
            return new AnalisisOutputDTO(
                    "En observación",                                     // 1. perfilFinanciero
                    0.82,                                                              // 2. probabilidad
                    Map.of("alimentacion", "420", "transporte", "300"),// 3. resumenGastos (Map<String, Object>)
                    List.of() // Recomendaciones vacías por el momento                 // 4. recomendaciones
            );
        }
    }
    // ️ NUEVA funcion PARA CATEGORIZAR UNA TRANSACCIÓN ️
    public String categorizarDescripcion(String descripcion) {
        try {
            // Preparamos el payload en JSON: {"descripcion": "Pago de servicios..."}
            Map<String, String> requestBody = Map.of("descripcion", descripcion);

            // Ajusta la URI según cómo esté definido el endpoint en Python (ej: /api/v1/categorizar)
            CategorizacionResponse response = nlpRestClient.post()
                    .uri("/api/v1/categorizar")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(CategorizacionResponse.class);

            return (response != null && response.categoria() != null)
                    ? response.categoria()
                    : "Otros";

        } catch (Exception e) {
            // Fallback en caso de que el servicio de Python no responda o falle
            return "Servicios"; // O "Otros" como categoría por defecto
        }
    }

    // Record auxiliar para mapear la respuesta del endpoint de Python
    public record CategorizacionResponse(String categoria) {}
}