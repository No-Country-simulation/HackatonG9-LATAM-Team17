package saludfinanciera.finanzas.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.response.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.error.DataErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.ErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.PythonServiceErrorDTO;
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

    @Operation(
            summary = "Procesar análisis financiero",
            description = "Recibe los datos de entrada requeridos y genera un resumen/resultado del análisis financiero."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Análisis procesado exitosamente",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnalisisOutputDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos o faltantes",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Conflicto o error de integridad de datos",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DataErrorResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno no controlado en el servidor",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @PostMapping("/analizar")
    public ResponseEntity<AnalisisOutputDTO> crearAnalisis(
            @RequestParam Long usuarioId,
            @Valid @RequestBody AnalisisInputDTO input) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(usuarioId, input);
        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "Clasificar transacción",
            description = "Envía una transacción financiera para ser clasificada dinámicamente mediante el servicio de IA/Python."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Transacción clasificada exitosamente",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = RespuestaPythonDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de la transacción inválidos o faltantes",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "502",
                    description = "Error en la respuesta del servicio externo de IA en Python",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PythonServiceErrorDTO.class))
            ),
            @ApiResponse(
                    responseCode = "503",
                    description = "Servicio de IA en Python no disponible o inalcanzable",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PythonServiceErrorDTO.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno no controlado en el servidor",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @PostMapping("/clasificar")
    public ResponseEntity<RespuestaPythonDTO> clasificarTransaccion(
            @Valid @RequestBody TransaccionDTO transaccionDTO) {
        RespuestaPythonDTO resultado = analisisService.clasificarTransaccion(transaccionDTO);
        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "Obtener historial por ID de usuario",
            description = "Consulta la lista de análisis financieros históricos asociados a un ID de usuario específico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial obtenido exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/historial/{usuarioId}")
    public ResponseEntity<List<AnalisisFinanciero>> obtenerHistorialPorUsuario(@PathVariable Long usuarioId) {
        List<AnalisisFinanciero> historial = analisisService.obtenerHistorialPorUsuario(usuarioId);
        return ResponseEntity.ok(historial);
    }

    @Operation(
            summary = "Obtener historial general",
            description = "Consulta el historial financiero del primer usuario activo registrado en el sistema."
    )
    @ApiResponse(responseCode = "200", description = "Historial general obtenido exitosamente")
    @GetMapping("/historial")
    public ResponseEntity<List<AnalisisFinanciero>> obtenerHistorialGeneral() {
        List<AnalisisFinanciero> historial = analisisService.obtenerHistorialGeneral();
        return ResponseEntity.ok(historial);
    }
}