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
            // FALLBACK TEMPORAL: Si Python no responde o no está disponible,
            // devolvemos un objeto Mock para no cortar el flujo de Spring Boot
            return new AnalisisOutputDTO(
                    "En observación",                                     // 1. perfilFinanciero
                    0.82,                                                              // 2. probabilidad
                    Map.of("alimentacion", "420", "transporte", "300"),// 3. categorias (Map<String, Object>)
                    List.of() // Recomendaciones vacías por el momento                 // 4. recomendaciones
            );
        }
    }
}