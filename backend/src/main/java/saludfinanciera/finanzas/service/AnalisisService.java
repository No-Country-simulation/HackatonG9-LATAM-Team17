package saludfinanciera.finanzas.service;

import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.client.NlpDataClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import saludfinanciera.finanzas.model.Transaccion;
import org.springframework.stereotype.Service;
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
        // 1. Mapear y guardar transacciones crudas
        List<Transaccion> entidades = inputDTO.getTransacciones().stream().map(dto -> {
            Transaccion t = new Transaccion();
            t.setUsuarioId(inputDTO.getUsuarioId());
            t.setDescripcion(dto.getDescripcion());
            t.setMonto(dto.getMonto());
            t.setTipo(dto.getTipo());
            t.setCategoria(dto.getCategoria());
            return t;
        }).toList();

        transaccionRepository.saveAll(entidades);

        // 2. Invocar al microservicio de Python NLP
        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        // 3. Persistir el resultado consolidado
        AnalisisFinanciero analisis = new AnalisisFinanciero();
        analisis.setUsuarioId(inputDTO.getUsuarioId());
        analisis.setEstadoFinanciero(respuestaNlp.getEstadoFinanciero());
        analisis.setDiagnostico(respuestaNlp.getDiagnostico());

        analisisRepository.save(analisis);

        // 4. Retornar respuesta al Frontend
        return respuestaNlp;
    }
}