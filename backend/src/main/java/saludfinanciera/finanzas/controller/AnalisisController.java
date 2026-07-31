package saludfinanciera.finanzas.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.service.AnalisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analisis")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(@NonNull AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    /**
     * Endpoint principal para procesar el análisis con el microservicio de IA (Python)
     */
    @PostMapping("/procesar")
    public ResponseEntity<AnalisisOutputDTO> procesarAnalisis(@Valid @RequestBody AnalisisInputDTO inputDTO) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(inputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado); // HTTP 201 Created
    }

    // --- ENDPOINTS GET ---

    /**
     * 1. Obtener transacciones por ID de Usuario
     */
    @GetMapping("/transacciones/usuario/{usuarioId}")
    public ResponseEntity<List<TransaccionResponseDTO>> obtenerTransaccionesPorUsuario(@PathVariable String usuarioId) {
        List<TransaccionResponseDTO> transacciones = analisisService.obtenerTransaccionesPorUsuario(usuarioId);
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204 No Content si no tiene registros
        }

        return ResponseEntity.ok(transacciones);
    }

    /**
     * 2. Obtener TODAS las transacciones cargadas
     */
    @GetMapping("/transacciones")
    public ResponseEntity<List<Transaccion>> obtenerTodasLasTransacciones() {
        List<Transaccion> transacciones = analisisService.obtenerTodasLasTransacciones();
        return ResponseEntity.ok(transacciones);
    }
}