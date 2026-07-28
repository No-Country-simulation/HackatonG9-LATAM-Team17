package saludfinanciera.finanzas.client;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;

import java.util.List;


@Component
public class PythonDataScienceClient {

    private final RestClient pythonRestClient;

   public PythonDataScienceClient(
           RestClient.Builder restClientBuilder,
           @Value("${python.nlp.service.url}") String pythonRestClientUrl
   ) {
       this.pythonRestClient = restClientBuilder
               .baseUrl(pythonRestClientUrl)
               .build();
   }

     public RespuestaPythonDTO obtenerAnalisisDesdePython(AnalisisInputDTO inputDTO) {
       try {

       return pythonRestClient.post() // Realiza una petición HTTP POST
               .uri("/api/v1/analizar-perfil") // Ruta del endpoint expuesto por la API de Python
               .contentType(MediaType.APPLICATION_JSON)
               .body(inputDTO) // Serializa automáticamente el objeto 'input' a JSON en el cuerpo de la petición
               .retrieve() // Ejecuta la petición y obtiene la respuesta HTTP
               .body(RespuestaPythonDTO.class); // Deserializa el JSON de respuesta hacia la clase RespuestaPython
    } catch (Exception e) {
           // FALLBACK TEMPORAL: Si Python no responde o no está disponible,
           // devolvemos un objeto Mock para no cortar el flujo de Spring Boot
           return new RespuestaPythonDTO(
                   0.75,
                   "Moderado",
                   List.of("GASTOS_GENERALES")
           );
       }
    }
}