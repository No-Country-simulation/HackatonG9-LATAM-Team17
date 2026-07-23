package saludfinanciera.finanzas.controller;


import jakarta.validation.Valid;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.TransaccionRepository;
import saludfinanciera.finanzas.service.AnalisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analisis")
public class AnalisisController {

    private final AnalisisService analisisService;

    private final TransaccionRepository transaccionRepository;

    public AnalisisController(AnalisisService analisisService, TransaccionRepository transaccionRepository) {
        this.analisisService = analisisService;
        this.transaccionRepository = transaccionRepository;
    }

    @PostMapping("/procesar")
    public ResponseEntity<AnalisisOutputDTO> procesarAnalisis(@Valid @RequestBody AnalisisInputDTO inputDTO) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(inputDTO);
        return ResponseEntity.ok(resultado);
    }

    // --- NUEVOS ENDPOINTS (GET para Python/Data) ---

    // 1. Obtener transacciones por ID de Usuario (ej: GET /api/v1/analisis/transacciones/USR-1001)
    @GetMapping("/transacciones/{usuarioId}")
    public ResponseEntity<List<Transaccion>> obtenerTransaccionesPorUsuario(@PathVariable String usuarioId) {
        List<Transaccion> transacciones = transaccionRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(transacciones);
    }

    // 2. Obtener TODAS las transacciones cargadas (ej: GET /api/v1/analisis/transacciones)
    @GetMapping("/transacciones")
    public ResponseEntity<List<Transaccion>> obtenerTodasLasTransacciones() {
        List<Transaccion> transacciones = transaccionRepository.findAll();
        return ResponseEntity.ok(transacciones);
    }
}