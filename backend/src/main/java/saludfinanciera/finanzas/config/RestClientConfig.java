package saludfinanciera.finanzas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${python.nlp.service.url}")
    private String nlpServiceUrl;

    @Bean
    public RestClient nplRestClient(){
        return RestClient.builder()
                .baseUrl(nlpServiceUrl)
                .build();
    }
}