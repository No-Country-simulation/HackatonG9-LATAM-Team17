package saludfinanciera.finanzas.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.service.AnalisisService;

@RestController
@RequestMapping("/api/v1/finanzas")
@CrossOrigin(origins = "*")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(AnalisisService analisisService) {
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
}