package saludfinanciera.finanzas.client;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;

@Component
public class NlpDataClient {

    private final RestClient nlpRestClient;

    public NlpDataClient(RestClient restClient) {
        this.nlpRestClient = restClient;
    }

    public AnalisisOutputDTO analizarPerfil(AnalisisInputDTO inputDTO) {
        return nlpRestClient.post()
                .uri("/api/v1/analizar-perfil") // O /categorizar según el caso
                .contentType(MediaType.APPLICATION_JSON)
                .body(inputDTO)
                .retrieve()
                .body(AnalisisOutputDTO.class);
    }
}