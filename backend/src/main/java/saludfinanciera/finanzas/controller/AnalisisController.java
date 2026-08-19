package saludfinanciera.finanzas.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.response.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import saludfinanciera.finanzas.service.AnalisisService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finanzas")
@CrossOrigin(origins = "*")
@Tag(name = "Análisis Financiero", description = "Endpoints para el procesamiento, clasificación y consulta del historial financiero")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(@NonNull AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @PostMapping("/analizar")
    public ResponseEntity<AnalisisOutputDTO> crearAnalisis(@Valid @RequestBody AnalisisInputDTO input) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(input);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/clasificar")
    public ResponseEntity<RespuestaPythonDTO> clasificarTransaccion(@Valid @RequestBody TransaccionDTO transaccionDTO) {
        RespuestaPythonDTO resultado = analisisService.clasificarTransaccion(transaccionDTO);
        return ResponseEntity.ok(resultado);
    }

    // Historial por ID específico
    @GetMapping("/historial/{usuarioId}")
    public ResponseEntity<List<AnalisisFinanciero>> obtenerHistorialPorUsuario(@PathVariable Long usuarioId) {
        List<AnalisisFinanciero> historial = analisisService.obtenerHistorialPorUsuario(usuarioId);
        return ResponseEntity.ok(historial);
    }

    // NUEVO: Historial general automático (ignora el ID y busca al usuario activo)
    @GetMapping("/historial")
    public ResponseEntity<List<AnalisisFinanciero>> obtenerHistorialGeneral() {
        List<AnalisisFinanciero> historial = analisisService.obtenerHistorialGeneral();
        return ResponseEntity.ok(historial);
    }
}