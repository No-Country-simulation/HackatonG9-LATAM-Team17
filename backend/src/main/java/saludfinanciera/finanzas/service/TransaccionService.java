package saludfinanciera.finanzas.service;

import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;

import java.util.List;

public interface TransaccionService {

    TransaccionResponseDTO registrarTransaccion(TransaccionDTO dto);
    TransaccionResponseDTO obtenerTransaccionPorId(Long id);
    List<TransaccionResponseDTO> obtenerTransaccionesPorUsuario(String usuarioId);
    TransaccionResponseDTO actualizarTransaccion(Long id, TransaccionDTO dto);
    void eliminarTransaccion(Long id);
}
