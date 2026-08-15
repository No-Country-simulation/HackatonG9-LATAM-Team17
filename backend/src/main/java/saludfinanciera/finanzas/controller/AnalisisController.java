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
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.error.DataErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.ErrorResponseDTO;
import saludfinanciera.finanzas.dto.error.PythonServiceErrorDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.service.AnalisisService;

@RestController
@RequestMapping("/api/v1/finanzas")
@CrossOrigin(origins = "*")
@Tag(name = "Análisis Financiero", description = "Endpoints para el procesamiento y clasificación de datos financieros")
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
                    responseCode = "415",
                    description = "Tipo de contenido (Content-Type) no soportado",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno no controlado en el servidor",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @PostMapping("/analizar")                                                 // ####### 1 #######
    public ResponseEntity<AnalisisOutputDTO> crearAnalisis(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de entrada para realizar el análisis",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AnalisisInputDTO.class))
            )
            @Valid @RequestBody AnalisisInputDTO input) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(input);
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
                    responseCode = "415",
                    description = "Tipo de contenido (Content-Type) no soportado",
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
    @PostMapping("/clasificar")                                               // ####### 2 #######
    public ResponseEntity<RespuestaPythonDTO> clasificarTransaccion(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de la transacción a clasificar",
                    required = true,
                    content = @Content(schema = @Schema(implementation = TransaccionDTO.class))
            )
            @Valid @RequestBody TransaccionDTO transaccionDTO) {
        RespuestaPythonDTO resultado = analisisService.clasificarTransaccion(transaccionDTO);
        return ResponseEntity.ok(resultado);
    }
}