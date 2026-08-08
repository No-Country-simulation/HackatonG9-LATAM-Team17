package saludfinanciera.finanzas.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import saludfinanciera.finanzas.dto.request.AnalisisCsvParamsDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.service.AnalisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analisis")
@Tag(name = "Análisis Financiero", description = "Endpoints para la gestión de transacciones, importación de CSV y motor de análisis financiero con IA")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(@NonNull AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @Operation(
            summary = "1. Generar análisis financiero del usuario",
            description = "Procesa los datos socioeconómicos e historial de transacciones para generar métricas de ahorro y diagnóstico mediante IA."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Análisis generado y almacenado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/perfil/{usuarioId}")                                         // ########### 1 #############
    public ResponseEntity<AnalisisOutputDTO> generarAnalisisPerfil(
            @Parameter(description = "Identificador del usuario", example = "USR-1001")
            @PathVariable String usuarioId,

            @Valid @RequestBody AnalisisInputDTO dto
    ) {
        AnalisisOutputDTO respuesta = analisisService.generarAnalisisPerfil(usuarioId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @Operation(
            summary = "2. Procesar y analizar archivo CSV de transacciones",
            description = "Permite la carga masiva de transacciones desde un CSV, categorizándolas e invocando el análisis de IA."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Archivo procesado y análisis generado exitosamente"),
            @ApiResponse(responseCode = "400", description = "El archivo CSV es inválido o está vacío")
    })
    @PostMapping(value = "/csv/{usuarioId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalisisOutputDTO> procesarCsv(
            @PathVariable String usuarioId,
            @Valid @ModelAttribute AnalisisCsvParamsDTO params
    ) {
        AnalisisOutputDTO resultado = analisisService.procesarYAnalizarCsv(
                usuarioId,
                params.file(),
                params.ingresoMensual(),
                params.ahorroActual(),
                params.metaAhorro(),
                Double.valueOf(params.nivelEndeudamiento())
        );
        return ResponseEntity.ok(resultado);
    }

    @Operation(
            summary = "3. Obtener historial de análisis por usuario",
            description = "Recupera los diagnósticos financieros generados previamente para un usuario específico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente"),
            @ApiResponse(responseCode = "204", description = "El usuario no posee análisis registrados")
    })
    @GetMapping("/usuario/{usuarioId}")                                             // ########## 3 ###############
    public ResponseEntity<List<AnalisisOutputDTO>> obtenerAnalisisPorUsuario(
            @Parameter(description = "Identificador del usuario", example = "USR-1001")
            @PathVariable String usuarioId
    ) {
        List<AnalisisOutputDTO> historial = analisisService.obtenerAnalisisPorUsuario(usuarioId);
        if (historial.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historial);
    }
}