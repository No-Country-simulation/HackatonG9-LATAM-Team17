package saludfinanciera.finanzas.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
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

            // Construimos el mapa de respaldo de forma segura
            Map<String, String> mapaFallback = new HashMap<>();
            mapaFallback.put("almuerzo", "Alimentación");
            mapaFallback.put("comida", "Alimentación");
            mapaFallback.put("gasolina", "Transporte");
            mapaFallback.put("moto", "Transporte");

            return new RespuestaPythonDTO(
                    0.75,
                    "En observación",
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

            // Validamos que la descripción no sea nula antes de ponerla en el mapa
            String desc = (transaccionDTO != null && transaccionDTO.descripcion() != null)
                    ? transaccionDTO.descripcion()
                    : "desconocido";

            Map<String, String> mapaFallbackIndividual = new HashMap<>();
            mapaFallbackIndividual.put(desc, "Ocio");

            return new RespuestaPythonDTO(
                    0.0,
                    "SIN_PERFIL",
                    mapaFallbackIndividual,
                    List.of("No fue posible obtener recomendaciones para esta transacción.")
            );
        }
    }
}