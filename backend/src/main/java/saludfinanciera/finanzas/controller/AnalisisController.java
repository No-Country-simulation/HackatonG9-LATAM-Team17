package saludfinanciera.finanzas.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Análisis Financiero", description = "Endpoints para la gestión de transacciones, importación de CSV y motor de análisis financiero con IA")
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
    @Operation(
            summary = "Procesar análisis financiero principal",
            description = "Envía la información del perfil del usuario al microservicio de IA (Python) para generar recomendaciones y diagnósticos."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Análisis generado exitosamente",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnalisisOutputDTO.class))),
            @ApiResponse(responseCode = "400", description = "Parámetros de entrada inválidos", content = @Content)
    })
    @PostMapping("/procesar")
    public ResponseEntity<AnalisisOutputDTO> procesarAnalisis(@Valid @RequestBody AnalisisInputDTO inputDTO) {
        AnalisisOutputDTO resultado = analisisService.procesarAnalisis(inputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado); // HTTP 201 Created
    }

    /**
     * 2. Registrar una transacción individual
     * POST /api/v1/analisis/transacciones
     */
    @Operation(
            summary = "Registrar una transacción individual",
            description = "Registra un nuevo ingreso o egreso. Si el campo categoría viene vacío, la IA (Python) infiere automáticamente la categoría basada en la descripción."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transacción creada exitosamente",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransaccionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos de transacción inválidos", content = @Content)
    })
    @PostMapping("/transacciones")
    public ResponseEntity<TransaccionResponseDTO> registrarTransaccion(@Valid @RequestBody TransaccionDTO transaccionDTO) {
        TransaccionResponseDTO nuevaTransaccion = analisisService.registrarTransaccion(transaccionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTransaccion); // HTTP 201 Created
    }
    /**
     * 3. Procesar análisis completo adjuntando un archivo CSV opcional (Multipart)
     * POST /api/v1/analisis/procesar-csv
     */
    @Operation(
            summary = "Procesar análisis completo adjuntando archivo CSV",
            description = "Procesa los datos de perfil junto con un archivo CSV opcional que contiene el historial de movimientos financieros."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Análisis y parsing de CSV ejecutados con éxito",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AnalisisOutputDTO.class))),
            @ApiResponse(responseCode = "400", description = "Estructura del CSV o JSON inválida", content = @Content)
    })
    @PostMapping(value = "/procesar-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalisisOutputDTO> analizarFinanzasConCsv(
            @Parameter(description = "Objeto JSON con los datos de perfil e ingresos del usuario", required = true)
            @RequestPart("datos") @Valid AnalisisInputDTO inputDTO,
            @Parameter(description = "Archivo CSV con el listado de transacciones (Opcional)")
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
    @Operation(
            summary = "Obtener todas las transacciones",
            description = "Retorna el listado completo de transacciones almacenadas en la base de datos."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de transacciones obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No existen transacciones registradas", content = @Content)
    })
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
    @Operation(
            summary = "Obtener transacciones por ID de usuario",
            description = "Filtra y retorna todas las transacciones asociadas a un identificador de usuario específico."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transacciones del usuario encontradas"),
            @ApiResponse(responseCode = "204", description = "El usuario no tiene transacciones registradas", content = @Content)
    })
    @GetMapping("/transacciones/usuario/{usuarioId}")
    public ResponseEntity<List<TransaccionResponseDTO>> obtenerTransaccionesPorUsuario(
            @Parameter(description = "Identificador único del usuario (Ej: USR-DEFAULT)", example = "USR-DEFAULT")
            @PathVariable String usuarioId) {
        List<TransaccionResponseDTO> transacciones = analisisService.obtenerTransaccionesPorUsuario(usuarioId);
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204 No Content si no tiene registros
        }
        return ResponseEntity.ok(transacciones); // HTTP 200 OK
    }
}