package saludfinanciera.finanzas.service;

import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.client.NlpDataClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import saludfinanciera.finanzas.repository.TransaccionRepository;

import java.util.List;
import java.util.stream.Collectors;


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

        // 1. Invocar al microservicio de Python NLP (devuelve Map<String, String> en .categoria())
        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        // 2. Extraer solo los valores del Mapa (sin duplicados) para convertirlos a la List de la Entidad
        List<String> categoriasConsolidadas = respuestaNlp.categorias() != null
                ? respuestaNlp.categorias().keySet().stream()
                  .distinct()
                  .collect(Collectors.toList())
                : List.of();

        // 3. Persistir en la BD (la Entidad recibe la List<String> limpia)
        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .ingresoMensual(inputDTO.ingresoMensual())
                .nivelEndeudamiento(inputDTO.nivelEndeudamiento())
                .frecuenciaAhorro(inputDTO.frecuenciaAhorro())
                .descripcion(inputDTO.descripcion())
                .valor(inputDTO.valor())
                .perfilFinanciero(respuestaNlp.perfilFinanciero())
                .probabilidad(respuestaNlp.probabilidad())
                .categorias(categoriasConsolidadas) // Asignación limpia de List<String>
                .build();

        analisisRepository.save(analisis);

        // 4. Retornar DTO de respuesta al Controller / Frontend
        return respuestaNlp;
    }

    @Transactional(readOnly = true)
    public List<TransaccionResponseDTO> obtenerTransaccionesPorUsuario(String usuarioId) {
        List<Transaccion> entidades = transaccionRepository.findByUsuarioId(usuarioId);

        return entidades.stream()
                .map(t -> new TransaccionResponseDTO(
                        t.getId(),
                        t.getUsuarioId(),
                        t.getMonto(),
                        t.getTipo(),
                        t.getDescripcion(),
                        t.getCategoria(),
                        t.getFechaTransaccion()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Transaccion> obtenerTodasLasTransacciones() {
        return transaccionRepository.findAll();
    }
}