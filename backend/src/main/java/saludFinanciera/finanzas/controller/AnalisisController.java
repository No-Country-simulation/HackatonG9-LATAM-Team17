package saludFinanciera.finanzas.controller;


import saludFinanciera.finanzas.dto.AnalisisInputDTO;
import saludFinanciera.finanzas.dto.AnalisisOutputDTO;
import saludFinanciera.finanzas.service.AnalisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/finanzas")
@CrossOrigin(origins = "*") // Permite que tu frontend se conecte sin problemas de CORS
public class AnalisisController {

    private final AnalisisService analisisService;

    // Inyección del servicio por constructor
    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @PostMapping("/analizar")
    public ResponseEntity<AnalisisOutputDTO> crearAnalisis(@RequestBody AnalisisInputDTO input) {
        // Recibe el JSON del cliente, lo pasa al servicio para procesar/guardar y retorna la respuesta
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(input);
        return ResponseEntity.ok(resultado);
    }
}