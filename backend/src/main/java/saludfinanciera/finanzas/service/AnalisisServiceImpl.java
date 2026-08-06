package saludfinanciera.finanzas.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import saludfinanciera.finanzas.client.NlpDataClient;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionItemDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import saludfinanciera.finanzas.repository.TransaccionRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalisisServiceImpl implements AnalisisService{

    // Declaración manual del logger
    private static final Logger log = LoggerFactory.getLogger(AnalisisServiceImpl.class);

    private final TransaccionRepository transaccionRepository;
    private final AnalisisFinancieroRepository analisisRepository;
    private final NlpDataClient nlpDataClient;
    private final CsvParserService csvParserService;

    public AnalisisServiceImpl(TransaccionRepository transaccionRepository, AnalisisFinancieroRepository analisisRepository, NlpDataClient nlpDataClient, CsvParserService csvParserService) {
        this.transaccionRepository = transaccionRepository;
        this.analisisRepository = analisisRepository;
        this.nlpDataClient = nlpDataClient;
        this.csvParserService = csvParserService;
    }

    // =========================================================================
    // 1. Generar análisis de perfil (JSON)
    // =========================================================================
    @Override
    @Transactional
    public AnalisisOutputDTO generarAnalisisPerfil(String usuarioId, AnalisisInputDTO inputDTO) {
        if (usuarioId == null || usuarioId.isBlank()) {
            throw new IllegalArgumentException("El ID de usuario es obligatorio para registrar el análisis.");
        }

        log.info("🤖 Procesando análisis de perfil financiero con IA para el usuario: {}", usuarioId);

        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        if (respuestaNlp == null) {
            throw new IllegalStateException("El servicio de análisis de IA no devolvió una respuesta válida.");
        }

        persistirAnalisis(usuarioId.trim(), inputDTO, respuestaNlp);

        return respuestaNlp;
    }

    // =========================================================================
    // 2. Procesar y analizar transacciones desde CSV
    // =========================================================================
    @Override
    @Transactional
    public AnalisisOutputDTO procesarYAnalizarCsv(String usuarioId, MultipartFile file) {
        if (usuarioId == null || usuarioId.isBlank()) {
            throw new IllegalArgumentException("El ID de usuario es obligatorio para procesar el archivo.");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("El archivo CSV no puede estar vacío.");
        }

        log.info("📄 Parseando archivo CSV y generando análisis para el usuario: {}", usuarioId);

        List<TransaccionItemDTO> transaccionesCsv = csvParserService.parsearTransacciones(file);

        // Construcción de input con valores por defecto para evaluación masiva desde CSV
        AnalisisInputDTO inputDTO = new AnalisisInputDTO(
                0.0,
                0,
                "MENSUAL",
                "Análisis masivo de transacciones desde CSV",
                0.0,
                transaccionesCsv
        );

        AnalisisOutputDTO respuestaNlp = nlpDataClient.analizarPerfil(inputDTO);

        if (respuestaNlp == null) {
            throw new IllegalStateException("El servicio NLP no devolvió una respuesta válida al procesar el CSV.");
        }

        persistirAnalisis(usuarioId.trim(), inputDTO, respuestaNlp);

        return respuestaNlp;
    }

    // =========================================================================
    // 3. Obtener historial de análisis por usuario
    // =========================================================================
    @Override
    @Transactional(readOnly = true)
    public List<AnalisisOutputDTO> obtenerAnalisisPorUsuario(String usuarioId) {
        if (usuarioId == null || usuarioId.isBlank()) {
            throw new IllegalArgumentException("El ID de usuario es obligatorio para consultar el historial.");
        }

        log.info("🔍 Consultando historial de análisis para el usuario: {}", usuarioId);

        return analisisRepository.findByUsuarioId(usuarioId.trim()).stream()
                .map(this::mapToAnalisisOutputDTO)
                .toList();
    }

    // =========================================================================
    // Métodos Auxiliares Privados
    // =========================================================================
    private void persistirAnalisis(String usuarioId, AnalisisInputDTO inputDTO, AnalisisOutputDTO respuestaNlp) {
        Map<String, Double> resumenGastosConvertido = Map.of();
        if (respuestaNlp.resumenGastos() != null) {
            resumenGastosConvertido = respuestaNlp.resumenGastos().entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> (entry.getValue() instanceof Number n) ? n.doubleValue() : 0.0
                    ));
        }

        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .usuarioId(usuarioId)
                .ingresoMensual(inputDTO.ingresoMensual())
                .nivelEndeudamiento(inputDTO.nivelEndeudamiento())
                .frecuenciaAhorro(inputDTO.frecuenciaAhorro())
                .descripcion(inputDTO.descripcion())
                .valor(inputDTO.valor())
                .perfilFinanciero(respuestaNlp.perfilFinanciero() != null ? respuestaNlp.perfilFinanciero() : "DESCONOCIDO")
                .probabilidad(respuestaNlp.probabilidad() != null ? respuestaNlp.probabilidad() : 0.0)
                .totalGastado(respuestaNlp.totalGastado() != null ? respuestaNlp.totalGastado() : 0.0)
                .capacidadAhorroMensual(respuestaNlp.capacidadAhorroMensual() != null ? respuestaNlp.capacidadAhorroMensual() : 0.0)
                .porcentajeTasaAhorro(respuestaNlp.porcentajeTasaAhorro() != null ? respuestaNlp.porcentajeTasaAhorro() : 0.0)
                .progresoMetaAhorro(respuestaNlp.progresoMetaAhorro() != null ? respuestaNlp.progresoMetaAhorro() : 0.0)
                .mesesParaMeta(respuestaNlp.mesesParaMeta() != null ? respuestaNlp.mesesParaMeta() : 0.0)
                .resumenGastos(resumenGastosConvertido)
                .recomendaciones(respuestaNlp.recomendaciones() != null ? respuestaNlp.recomendaciones() : List.of())
                .build();

        analisisRepository.save(analisis);
    }

    private AnalisisOutputDTO mapToAnalisisOutputDTO(AnalisisFinanciero entidad) {
        Map<String, Object> resumenObj = entidad.getResumenGastos() != null
                ? new HashMap<>(entidad.getResumenGastos())
                : Map.of();

        return new AnalisisOutputDTO(
                entidad.getPerfilFinanciero(),
                entidad.getProbabilidad(),
                resumenObj,
                entidad.getRecomendaciones(),
                entidad.getTotalGastado(),
                entidad.getCapacidadAhorroMensual(),
                entidad.getPorcentajeTasaAhorro(),
                entidad.getProgresoMetaAhorro(),
                entidad.getMesesParaMeta()
        );
    }
}