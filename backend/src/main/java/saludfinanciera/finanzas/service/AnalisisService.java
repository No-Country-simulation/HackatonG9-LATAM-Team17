package saludfinanciera.finanzas.service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import saludfinanciera.finanzas.client.NlpDataClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.request.TransaccionItemDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import saludfinanciera.finanzas.repository.TransaccionRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class AnalisisService {

    private final TransaccionRepository transaccionRepository;
    private final AnalisisFinancieroRepository analisisRepository;
    private final NlpDataClient nlpDataClient;
    private final CsvParserService csvParserService;

    public AnalisisService(TransaccionRepository transaccionRepository, AnalisisFinancieroRepository analisisRepository, NlpDataClient nlpDataClient, CsvParserService csvParserService) {
        this.transaccionRepository = transaccionRepository;
        this.analisisRepository = analisisRepository;
        this.nlpDataClient = nlpDataClient;
        this.csvParserService = csvParserService;
    }
    @Transactional
    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO inputDTO) {

        // 1. Invocar al microservicio de Python NLP
        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        // Guardas en variables seguras (evitando NullPointerException)
        String perfil = respuestaNlp != null ? respuestaNlp.perfilFinanciero() : null;
        Double probabilidad = respuestaNlp != null ? respuestaNlp.probabilidad() : null;
        Map<String, Object> resumen = (respuestaNlp != null && respuestaNlp.resumenGastos() != null)
                ? respuestaNlp.resumenGastos()
                : Map.of();

        // 2. Extraer las llaves del mapa de resumen para guardarlas en la colección de categorias
        List<String> categoriasConsolidadas = resumen.keySet().stream()
                .distinct()
                .collect(Collectors.toList());

        List<String> recomendaciones = respuestaNlp != null && respuestaNlp.recomendaciones() != null
                ? respuestaNlp.recomendaciones()
                : List.of();

        // 3. Persistir en la BD Postgres
        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .ingresoMensual(inputDTO.ingresoMensual())
                .nivelEndeudamiento(inputDTO.nivelEndeudamiento())
                .frecuenciaAhorro(inputDTO.frecuenciaAhorro())
                .descripcion(inputDTO.descripcion())
                .valor(inputDTO.valor())
                .perfilFinanciero(perfil)
                .probabilidad(probabilidad)
                .categorias(categoriasConsolidadas)
                .recomendaciones(recomendaciones)
                .build();

        analisisRepository.save(analisis);

        // 4. Retornar una respuesta DTO bien construida
        return new AnalisisOutputDTO(
                perfil,
                probabilidad,
                resumen,
                recomendaciones
        );
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
                        t.getFechaTransaccion(),
                        t.getAnalisis() != null ? t.getAnalisis().getId() : null // 8º argumento añadido
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Transaccion> obtenerTodasLasTransacciones() {

        return transaccionRepository.findAll();
    }

    @Transactional
    public TransaccionResponseDTO registrarTransaccion(TransaccionDTO dto) {

        // 1. Resolver la categoría (si no viene o está vacía, consultar a Python NLP)
        String categoriaFinal = dto.categoria();

        if (categoriaFinal == null || categoriaFinal.isBlank()) {
            try {
                // Invocación al microservicio de Python NLP pasándole la descripción
                categoriaFinal = nlpDataClient.categorizarDescripcion(dto.descripcion());
            } catch (Exception e) {
                // Fallback de seguridad por si falla la llamada HTTP al microservicio
                categoriaFinal = "Otros";
            }
        }

        // 2. Mapear DTO de entrada a Entidad JPA con la categoría resuelta
        Transaccion entidad = Transaccion.builder()
                .descripcion(dto.descripcion())
                .monto(dto.monto())
                .tipo(dto.tipo())
                .categoria(categoriaFinal)
                .usuarioId("USR-DEFAULT")
                .build();

        // 3. Guardar en PostgreSQL (@PrePersist asignará fechaTransaccion)
        Transaccion guardada = transaccionRepository.save(entidad);

        // 4. Retornar DTO de respuesta
        return new TransaccionResponseDTO(
                guardada.getId(),
                guardada.getUsuarioId(),
                guardada.getMonto(),
                guardada.getTipo(),
                guardada.getDescripcion(),
                guardada.getCategoria(),
                guardada.getFechaTransaccion(),
                guardada.getAnalisis() != null ? guardada.getAnalisis().getId() : null // O el DTO del análisis
        );
    }

    @Transactional
    public AnalisisOutputDTO realizarAnalisisFinanciero(AnalisisInputDTO inputDTO, MultipartFile archivoCsv) {

        // 1. Recopilamos transacciones enviadas en JSON
        List<TransaccionItemDTO> historialCompleto = new ArrayList<>();
        if (inputDTO.historialTransacciones() != null) {
            historialCompleto.addAll(inputDTO.historialTransacciones());
        }

        // 2. Si hay CSV, parseamos y sumamos a la lista en memoria (sin guardar las filas sueltas en BD)
        if (archivoCsv != null && !archivoCsv.isEmpty()) {
            List<TransaccionItemDTO> transaccionesDelCsv = csvParserService.parsearTransacciones(archivoCsv);
            historialCompleto.addAll(transaccionesDelCsv);
        }

        // 3. Recreamos el DTO consolidado
        AnalisisInputDTO dtoConHistorial = new AnalisisInputDTO(
                inputDTO.ingresoMensual(),
                inputDTO.nivelEndeudamiento(),
                inputDTO.frecuenciaAhorro(),
                inputDTO.descripcion(),
                inputDTO.valor(),
                historialCompleto
        );

        // 4. Enviamos a FastAPI para el procesamiento pesado con Pandas + IA
        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(dtoConHistorial);

        // 5. Extraemos las categorías resueltas para la entidad
        List<String> categoriasConsolidadas = respuestaNlp.resumenGastos() != null
                ? respuestaNlp.resumenGastos().keySet().stream().distinct().toList()
                : List.of();

        // 6. PERSISTIMOS ÚNICAMENTE EL RESUMEN / RESULTADO DEL ANÁLISIS EN LA BD
        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .ingresoMensual(inputDTO.ingresoMensual())
                .nivelEndeudamiento(inputDTO.nivelEndeudamiento())
                .frecuenciaAhorro(inputDTO.frecuenciaAhorro())
                .descripcion(inputDTO.descripcion())
                .valor(inputDTO.valor())
                .perfilFinanciero(respuestaNlp.perfilFinanciero())
                .probabilidad(respuestaNlp.probabilidad())
                .categorias(categoriasConsolidadas)
                .build();

        analisisRepository.save(analisis);

        // 7. Retornamos la respuesta al cliente
        return respuestaNlp;
    }
}