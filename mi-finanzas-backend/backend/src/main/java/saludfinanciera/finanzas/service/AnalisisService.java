package saludfinanciera.finanzas.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.client.PythonDataScienceClient;
import saludfinanciera.finanzas.dto.response.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.exception.ResourceNotFoundException;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import saludfinanciera.finanzas.model.CategoriaAnalisis;
import saludfinanciera.finanzas.model.TransaccionAnalisis;
import saludfinanciera.finanzas.model.Usuario;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import saludfinanciera.finanzas.repository.UsuarioRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisService {

    private final PythonDataScienceClient pythonClient;
    private final AnalisisFinancieroRepository analisisRepository;
    private final UsuarioRepository usuarioRepository;

    public AnalisisService(
            PythonDataScienceClient pythonClient,
            AnalisisFinancieroRepository analisisRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.pythonClient = pythonClient;
        this.analisisRepository = analisisRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO input) {
        Usuario usuarioDefault = usuarioRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No hay usuarios registrados en el sistema."));
        return procesarAnalisisLogica(usuarioDefault.getId(), input);
    }

    @Transactional
    public AnalisisOutputDTO procesarAnalisis(Long usuarioId, AnalisisInputDTO input) {
        return procesarAnalisisLogica(usuarioId, input);
    }

    private AnalisisOutputDTO procesarAnalisisLogica(Long usuarioId, AnalisisInputDTO input) {

        if (input == null || input.transacciones() == null || input.transacciones().isEmpty()) {
            throw new ResourceNotFoundException("No se proporcionaron transacciones válidas para realizar el análisis.");
        }

        RespuestaPythonDTO dsResponse = pythonClient.obtenerAnalisisDesdePython(input);

        if (dsResponse == null) {
            throw new ResourceNotFoundException("No se pudo obtener una respuesta válida del motor de análisis.");
        }

        Double probabilidadPromedio = calcularPromedioProbabilidades(
                dsResponse.probabilidadCategoria(),
                dsResponse.probabilidadPerfilFinanciero(),
                dsResponse.probabilidadRecomendaciones()
        );

        Map<String, Double> resumenGastosPorCategoria = new HashMap<>();
        if (dsResponse.resumenGastos() != null && !dsResponse.resumenGastos().isEmpty()) {
            resumenGastosPorCategoria.putAll(dsResponse.resumenGastos());
        } else {
            for (TransaccionDTO t : input.transacciones()) {
                resumenGastosPorCategoria.merge("Ocio", t.valor(), Double::sum);
            }
        }

        List<String> recomendaciones = dsResponse.recomendaciones();
        if (recomendaciones == null || recomendaciones.isEmpty()) {
            recomendaciones = List.of("Mantener un control regular de tus gastos.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        AnalisisFinanciero analisis = AnalisisFinanciero.builder()
                .usuario(usuario)
                .perfilFinanciero(dsResponse.perfilFinanciero())
                .recomendaciones(new ArrayList<>(recomendaciones))
                .build();

        List<TransaccionAnalisis> listaTransaccionesBD = new ArrayList<>();
        if (input.transacciones() != null) {
            for (TransaccionDTO tDto : input.transacciones()) {
                TransaccionAnalisis tEntity = TransaccionAnalisis.builder()
                        .descripcion(tDto.descripcion())
                        .valor(tDto.valor())
                        .fechaTransaccion(tDto.fechaTransaccion())
                        .analisisFinanciero(analisis)
                        .build();
                listaTransaccionesBD.add(tEntity);
            }
        }
        analisis.setTransacciones(listaTransaccionesBD);

        List<CategoriaAnalisis> listaCategoriasBD = new ArrayList<>();
        for (Map.Entry<String, Double> entry : resumenGastosPorCategoria.entrySet()) {
            CategoriaAnalisis catEntity = CategoriaAnalisis.builder()
                    .categoria(entry.getKey())
                    .analisisFinanciero(analisis)
                    .build();
            listaCategoriasBD.add(catEntity);
        }
        analisis.setCategorias(listaCategoriasBD);

        analisisRepository.save(analisis);

        return new AnalisisOutputDTO(
                dsResponse.perfilFinanciero(),
                probabilidadPromedio,
                resumenGastosPorCategoria,
                recomendaciones
        );
    }

    public RespuestaPythonDTO clasificarTransaccion(TransaccionDTO transaccionDTO) {
        if (transaccionDTO == null) {
            throw new ResourceNotFoundException("Los datos de la transacción no pueden ser nulos.");
        }
        RespuestaPythonDTO respuesta = pythonClient.obtenerClasificacionDesdePython(transaccionDTO);
        if (respuesta == null) {
            throw new ResourceNotFoundException("No se obtuvo respuesta para la clasificación de la transacción.");
        }
        return respuesta;
    }

    public Page<AnalisisFinanciero> obtenerHistorialPorUsuario(Long usuarioId, Pageable pageable) {
        return analisisRepository.findByUsuarioIdOrderByFechaAnalisisDesc(usuarioId, pageable);
    }

    public Page<AnalisisFinanciero> obtenerHistorialGeneral(Pageable pageable) {
        Usuario usuario = usuarioRepository.findAll().stream().findFirst().orElse(null);
        if (usuario == null) {
            return Page.empty(pageable);
        }
        return analisisRepository.findByUsuarioIdOrderByFechaAnalisisDesc(usuario.getId(), pageable);
    }

    private Double calcularPromedioProbabilidades(Double... probs) {
        double suma = 0.0;
        int count = 0;
        for (Double p : probs) {
            if (p != null) {
                suma += p;
                count++;
            }
        }
        return count > 0 ? (suma / count) : 0.0;
    }
}