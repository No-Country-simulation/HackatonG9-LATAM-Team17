package saludfinanciera.finanzas.service;

import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.client.NlpDataClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import saludfinanciera.finanzas.repository.TransaccionRepository;

import java.util.List;


@Service
public class AnalisisService {

    private final TransaccionRepository transaccionRepository;
    private final AnalisisFinancieroRepository analisisRepository;
    private final NlpDataClient nlpDataClient;

    public AnalisisService(TransaccionRepository transaccionRepository, AnalisisFinancieroRepository analisisRepository, NlpDataClient nlpDataClient) {
        this.transaccionRepository = transaccionRepository;
        this.analisisRepository = analisisRepository;
        this.nlpDataClient = nlpDataClient;
    }


    @Transactional
    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO inputDTO) {

        // 1. Invocar al microservicio de Python NLP
        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        // 2. Mapear y persistir el resultado consolidado
        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .ingresoMensual(inputDTO.ingresoMensual())
                .nivelEndeudamiento(inputDTO.nivelEndeudamiento())
                .frecuenciaAhorro(inputDTO.frecuenciaAhorro())
                .descripcion(inputDTO.descripcion())
                .valor(inputDTO.valor())
                .perfilFinanciero(respuestaNlp.perfilFinanciero())
                .probabilidad(respuestaNlp.probabilidad())
                .categoria(respuestaNlp.categoria())
                .build();

        analisisRepository.save(analisis);

        // 3. Retornar respuesta al Frontend
        return respuestaNlp;
    }

    @Transactional(readOnly = true)
    public List<Transaccion> obtenerTransaccionesPorUsuario(String usuarioId) {
        return transaccionRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Transaccion> obtenerTodasLasTransacciones() {
        return transaccionRepository.findAll();
    }

}