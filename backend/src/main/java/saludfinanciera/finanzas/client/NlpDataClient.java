package saludfinanciera.finanzas.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;

import java.util.List;

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
                    List.of("GASTOS_GENERALES"),
                    "Moderado",
                    0.75
            );
        }
    }
}