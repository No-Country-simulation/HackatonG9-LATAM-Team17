package saludfinanciera.finanzas.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;
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

    // ==========================================
    // 📌 ENDPOINTS POST (Creación / Procesamiento)
    // ==========================================

    /**
     * 1. Procesar análisis principal con el microservicio de IA (Python)
     * POST /api/v1/analisis/procesar
     */
    @PostMapping("/procesar")
    public ResponseEntity<AnalisisOutputDTO> procesarAnalisis(@Valid @RequestBody AnalisisInputDTO inputDTO) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(inputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado); // HTTP 201 Created
    }

    /**
     * 2. Registrar una transacción individual
     * POST /api/v1/analisis/transacciones
     */
    @PostMapping("/transacciones")
    public ResponseEntity<TransaccionResponseDTO> registrarTransaccion(@Valid @RequestBody TransaccionDTO transaccionDTO) {
        TransaccionResponseDTO nuevaTransaccion = analisisService.registrarTransaccion(transaccionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTransaccion); // HTTP 201 Created
    }
    /**
     * 3. Procesar análisis completo adjuntando un archivo CSV opcional (Multipart)
     * POST /api/v1/analisis/procesar-csv
     */
    @PostMapping(value = "/procesar-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalisisOutputDTO> analizarFinanzasConCsv(
            @RequestPart("datos") @Valid AnalisisInputDTO inputDTO,
            @RequestPart(value = "archivo", required = false) MultipartFile archivoCsv
    ) {
        AnalisisOutputDTO resultado = analisisService.realizarAnalisisFinanciero(inputDTO, archivoCsv);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado); // HTTP 201 Created
    }

    // ==========================================
    // 📌 ENDPOINTS GET (Consultas)
    // ==========================================

    /**
     * 4. Obtener TODAS las transacciones cargadas en la DB
     * GET /api/v1/analisis/transacciones
     */
    @GetMapping("/transacciones")
    public ResponseEntity<List<Transaccion>> obtenerTodasLasTransacciones() {
        List<Transaccion> transacciones = analisisService.obtenerTodasLasTransacciones();
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204 No Content
        }
        return ResponseEntity.ok(transacciones); // HTTP 200 OK
    }

    /**
     * 5. Obtener transacciones por ID de Usuario
     * GET /api/v1/analisis/transacciones/usuario/{usuarioId}
     */
    @GetMapping("/transacciones/usuario/{usuarioId}")
    public ResponseEntity<List<TransaccionResponseDTO>> obtenerTransaccionesPorUsuario(@PathVariable String usuarioId) {
        List<TransaccionResponseDTO> transacciones = analisisService.obtenerTransaccionesPorUsuario(usuarioId);
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204 No Content si no tiene registros
        }
        return ResponseEntity.ok(transacciones); // HTTP 200 OK
    }
}