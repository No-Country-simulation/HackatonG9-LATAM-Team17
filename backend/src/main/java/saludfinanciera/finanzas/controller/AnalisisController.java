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
    //    private final TransaccionRepository transaccionRepository;

    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }
    // Endpoint principal de análisis con IA
    @PostMapping("/procesar")
    public ResponseEntity<AnalisisOutputDTO> procesarAnalisis(@Valid @RequestBody AnalisisInputDTO inputDTO) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(inputDTO);
        return ResponseEntity.ok(resultado);
    }

    // --- ENDPOINTS GET (Delegados al Service) ---

    // 1. Obtener transacciones por ID de Usuario
    @GetMapping("/transacciones/{usuarioId}")
    public ResponseEntity<List<Transaccion>> obtenerTransaccionesPorUsuario(@PathVariable String usuarioId) {
        List<Transaccion> transacciones = analisisService.obtenerTransaccionesPorUsuario(usuarioId);
        return ResponseEntity.ok(transacciones);
    }

    // 2. Obtener TODAS las transacciones cargadas
    @GetMapping("/transacciones")
    public ResponseEntity<List<Transaccion>> obtenerTodasLasTransacciones() {
        List<Transaccion> transacciones = analisisService.obtenerTodasLasTransacciones();
        return ResponseEntity.ok(transacciones);
    }
}