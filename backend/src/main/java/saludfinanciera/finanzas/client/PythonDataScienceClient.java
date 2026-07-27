package saludfinanciera.finanzas.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;

// @Component registra esta clase como un Bean gestionado por el contenedor de Spring.
// @RequiredArgsConstructor (de Lombok) genera un constructor con los atributos marcados como 'final'.
@Component
@RequiredArgsConstructor
public class PythonDataScienceClient {

    // Spring inyectará automáticamente el RestClient que configuramos en la clase PythonClientConfig.
    private final RestClient pythonRestClient;

    /**
     * Envía la información financiera al microservicio de Python y mapea la respuesta.
     *
     * @param input DTO que contiene las transacciones e ingresos recibidos en la API.
     * @return DTO RespuestaPython enviado por el servicio de Data Science.
     */
    public RespuestaPythonDTO obtenerAnalisisDesdePython(AnalisisInputDTO input) {
        return pythonRestClient.post() // Realiza una petición HTTP POST
                .uri("/api/v1/analizar") // Ruta del endpoint expuesto por la API de Python
                .body(input) // Serializa automáticamente el objeto 'input' a JSON en el cuerpo de la petición
                .retrieve() // Ejecuta la petición y obtiene la respuesta HTTP
                .body(RespuestaPythonDTO.class); // Deserializa el JSON de respuesta hacia la clase RespuestaPython
    }
}