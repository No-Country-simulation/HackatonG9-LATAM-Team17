package saludfinanciera.finanzas.service;

import saludfinanciera.finanzas.client.PythonDataScienceClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisService {

    private final AnalisisFinancieroRepository analisisRepository;
    private final PythonDataScienceClient pythonClient;

    public AnalisisService(AnalisisFinancieroRepository analisisRepository,
                           PythonDataScienceClient pythonClient) {
        this.analisisRepository = analisisRepository;
        this.pythonClient = pythonClient;
    }

    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO input) {
        // 1. Consulta la API de Python
        RespuestaPythonDTO dsResponse = pythonClient.obtenerAnalisisDesdePython(input);

        // 2. Persiste la respuesta en PostgreSQL
        AnalisisFinanciero analisisDb = new AnalisisFinanciero();
        analisisDb.setIngresoMensual(input.ingresoMensual());
        analisisDb.setNivelEndeudamiento(input.nivelEndeudamiento());
        analisisDb.setFrecuenciaAhorro(input.frecuenciaAhorro());

        // Asignación de los datos retornados por Data Science
        analisisDb.setPerfilFinanciero(dsResponse.perfilFinanciero());
        analisisDb.setProbabilidadIa(dsResponse.probabilidad());
        analisisDb.setCategoria(dsResponse.categoria());

        analisisRepository.save(analisisDb);

        // 3. Mapeo al DTO de salida esperado por tu frontend/API
        // (Ajusta la construcción del resumen o recomendaciones según lo requiera AnalisisOutputDTO)
        Map<String, Double> resumenGastos = new HashMap<>();
        List<String> recomendaciones = List.of();

        return new AnalisisOutputDTO(
                dsResponse.perfilFinanciero(),
                dsResponse.probabilidad(),
               // resumenGastos,
               //  recomendaciones,
                dsResponse.categoria()
        );
    }
}