package saludfinanciera.finanzas.service;

import org.springframework.web.multipart.MultipartFile;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;

import java.util.List;

public interface AnalisisService {

    AnalisisOutputDTO generarAnalisisPerfil(String usuarioId, AnalisisInputDTO inputDTO);

    AnalisisOutputDTO procesarYAnalizarCsv(String usuarioId, MultipartFile file);

    List<AnalisisOutputDTO> obtenerAnalisisPorUsuario(String usuarioId);

}
