package saludfinanciera.finanzas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

// @Configuration le indica a Spring que esta clase contiene definiciones de infraestructura o beans.
@Configuration
public class PythonClientConfig {

    // @Value inyecta la URL desde application.properties (ej. python.service.url=http://localhost:8000).
    // Si la propiedad no existe en el archivo, usa el valor por defecto "http://localhost:8000".
    @Value("${python.service.url:http://localhost:8000}")
    private String pythonServiceUrl;

    // @Bean registra este objeto en el contenedor de Spring para poder inyectarlo en otras clases.
    @Bean
    public RestClient pythonRestClient() {
        // RestClient es el cliente HTTP nativo de Spring Boot 3 para hacer peticiones REST.
        return RestClient.builder()
                .baseUrl(pythonServiceUrl) // Establece la URL base del microservicio de Python
                .defaultHeader("Content-Type", "application/json") // Define que todas las enviadas serán JSON
                .build();
    }
}