package saludfinanciera.finanzas.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;
import saludfinanciera.finanzas.exception.ResourceNotFoundException;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.TransaccionRepository;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class TransaccionServiceImpl implements TransaccionService{

    private final TransaccionRepository transaccionRepository;

    public TransaccionServiceImpl(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
    }

    @Override
    @Transactional
    public TransaccionResponseDTO registrarTransaccion(TransaccionDTO dto) {
        log.info("💾 Registrando nueva transacción para usuario: {}", dto.usuarioId());

        Transaccion transaccion = new Transaccion();
        transaccion.setUsuarioId(dto.usuarioId());
        transaccion.setMonto(dto.monto());
        transaccion.setTipo(dto.tipo());
        transaccion.setDescripcion(dto.descripcion());
        transaccion.setCategoria(dto.categoria());
        transaccion.setFechaTransaccion(LocalDateTime.now());
        transaccion.setActivo(true);

        Transaccion guardada = transaccionRepository.save(transaccion);
        return convertirATransaccionResponseDTO(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public TransaccionResponseDTO obtenerTransaccionPorId(Long id) {
        log.info("🔎 Buscando transacción con ID: {}", id);

        Transaccion transaccion = transaccionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la transacción activa con ID: " + id));

        return convertirATransaccionResponseDTO(transaccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransaccionResponseDTO> obtenerTransaccionesPorUsuario(String usuarioId) {
        log.info("📋 Obteniendo historial de transacciones para el usuario: {}", usuarioId);

        return transaccionRepository.findByUsuarioIdAndActivoTrue(usuarioId)
                .stream()
                .map(this::convertirATransaccionResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public TransaccionResponseDTO actualizarTransaccion(Long id, TransaccionDTO dto) {
        log.info("✏️ Actualizando transacción con ID: {}", id);

        Transaccion transaccionExistente = transaccionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la transacción activa con ID: " + id));

        // Se actualizan únicamente los datos mutables; usuarioId permanece intacto
        transaccionExistente.setMonto(dto.monto());
        transaccionExistente.setTipo(dto.tipo());
        transaccionExistente.setDescripcion(dto.descripcion());
        transaccionExistente.setCategoria(dto.categoria());

        Transaccion actualizada = transaccionRepository.save(transaccionExistente);
        return convertirATransaccionResponseDTO(actualizada);
    }

    @Override
    @Transactional
    public void eliminarTransaccion(Long id) {
        log.info("🗑️ Desactivando (soft delete) transacción con ID: {}", id);

        Transaccion transaccion = transaccionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la transacción activa con ID: " + id));

        transaccion.setActivo(false);
        transaccionRepository.save(transaccion);
    }

    private TransaccionResponseDTO convertirATransaccionResponseDTO(Transaccion entity) {
        return new TransaccionResponseDTO(
                entity.getId(),
                entity.getUsuarioId(),
                entity.getMonto(),
                entity.getTipo(),
                entity.getDescripcion(),
                entity.getCategoria(),
                entity.getFechaTransaccion(),
                entity.getAnalisis() != null ? entity.getAnalisis().getId() : null
        );
    }
}
