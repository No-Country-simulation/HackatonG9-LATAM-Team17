package saludfinanciera.finanzas.controller;

import jakarta.validation.Valid;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.service.AnalisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Define que esta clase expone endpoints REST devolviendo respuestas en formato JSON.
@RequestMapping("/api/v1/finanzas") // Define el prefijo de URL global para todos los métodos de este controlador.
@CrossOrigin(origins = "*") // Permite peticiones desde aplicaciones web externas/frontends (CORS).
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    /**
     * ITEM 1: Endpoint para análisis financiero global
     * URL: POST http://localhost:8080/api/v1/finanzas/analizar
     */
    @PostMapping("/analizar")
    public ResponseEntity<AnalisisOutputDTO> crearAnalisis(@Valid @RequestBody AnalisisInputDTO input) {

        // =========================================================================
        // IMPRESIONES EN CONSOLA (SOUT) PARA VERIFICAR EL JSON DEL FRONTEND
        // =========================================================================
        System.out.println(">>> PETICIÓN RECIBIDA EN /analizar <<<");
        System.out.println("Ingreso Mensual: " + input.ingresoMensual());
        System.out.println("Nivel Endeudamiento: " + input.nivelEndeudamiento());
        System.out.println("Frecuencia Ahorro: " + input.frecuenciaAhorro());
        System.out.println("Total Transacciones recibidas: " + (input.transacciones() != null ? input.transacciones().size() : 0));
        System.out.println("DTO Completo: " + input);
        System.out.println("-----------------------------------------------------");

        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(input);

        // Retorna HTTP Status 200 OK junto con el cuerpo JSON
        return ResponseEntity.ok(resultado);
    }

    /**
     * ITEM 2: Endpoint para clasificación rápida de transacciones individuales
     * URL: POST http://localhost:8080/api/v1/finanzas/clasificar
     */
    @PostMapping("/clasificar")
    public ResponseEntity<RespuestaPythonDTO> clasificarTransaccion(@Valid @RequestBody TransaccionDTO transaccionDTO) {

        // =========================================================================
        // IMPRESIÓN EN CONSOLA (SOUT) PARA CLASIFICACIÓN INDIVIDUAL
        // =========================================================================
        System.out.println(">>> PETICIÓN RECIBIDA EN /clasificar <<<");
        System.out.println("Descripción: " + transaccionDTO.descripcion());
        System.out.println("Valor: " + transaccionDTO.valor());
        System.out.println("-----------------------------------------------------");

        RespuestaPythonDTO resultado = analisisService.clasificarTransaccion(transaccionDTO);
        return ResponseEntity.ok(resultado);
    }
}