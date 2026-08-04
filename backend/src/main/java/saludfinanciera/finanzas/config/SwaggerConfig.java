package saludfinanciera.finanzas.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Salud Financiera")
                        .version("1.0.0")
                        .description("Documentación de endpoints para análisis financiero, procesamiento de CSV y transacciones.")
                        .version("1.1 (AI-Enhanced)")
                        .contact(new Contact()
                                .name("Equipo Backend-Cris959")
                                .email("backend@forohub.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://foro.hub/api/licencia")));
    }
}
