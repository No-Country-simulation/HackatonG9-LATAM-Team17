package saludfinanciera.finanzas.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.TransaccionResponseDTO;
import saludfinanciera.finanzas.service.TransaccionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@Tag(name = "Transacciones", description = "Endpoints para gestión de movimientos financieros")
public class TransaccionController {

    private final TransaccionService transaccionService;

    public TransaccionController(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    // 1. Registrar nueva transacción
    @Operation(
            summary = "1. Registrar una nueva transacción",
            description = "Crea un registro de movimiento financiero (INGRESO/EGRESO). Si no se especifica categoría, la IA intentará categorizarlo."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transacción registrada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Payload con datos de entrada inválidos")
    })
    @PostMapping
    public ResponseEntity<TransaccionResponseDTO> registrarTransaccion(
            @Valid @RequestBody TransaccionDTO dto
    ) {
        TransaccionResponseDTO respuesta = transaccionService.registrarTransaccion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    // 2. Obtener transacción por ID
    @Operation(
            summary = "2. Obtener transacción por ID",
            description = "Recupera los detalles de una transacción activa según su identificador único en la base de datos."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transacción encontrada"),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada o inactiva")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TransaccionResponseDTO> obtenerPorId(
            @Parameter(description = "ID de la transacción", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(transaccionService.obtenerTransaccionPorId(id));
    }

    // 3. Obtener transacciones por Usuario
    @Operation(
            summary = "3. Obtener transacciones por usuario",
            description = "Obtiene el historial de transacciones activas vinculadas a un identificador de usuario."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de transacciones obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "El usuario no posee transacciones registradas")
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<TransaccionResponseDTO>> obtenerPorUsuario(
            @Parameter(description = "Identificador único del usuario", example = "USR-1001")
            @PathVariable String usuarioId
    ) {
        List<TransaccionResponseDTO> transacciones = transaccionService.obtenerTransaccionesPorUsuario(usuarioId);
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transacciones);
    }

    // 4. Actualizar transacción
    @Operation(
            summary = "4. Actualizar una transacción",
            description = "Actualiza los campos mutables (monto, tipo, descripción, categoría) de una transacción existente por su ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transacción actualizada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada o inactiva")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponseDTO> actualizarTransaccion(
            @Parameter(description = "ID de la transacción a actualizar", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody TransaccionDTO dto
    ) {
        return ResponseEntity.ok(transaccionService.actualizarTransaccion(id, dto));
    }

    // 5. Eliminar transacción (Soft Delete)
    @Operation(
            summary = "5. Eliminar una transacción",
            description = "Realiza un borrado lógico (soft delete) cambiando el estado de la transacción a inactiva."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Transacción desactivada correctamente"),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada o previamente inhabilitada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTransaccion(
            @Parameter(description = "ID de la transacción a eliminar", example = "1")
            @PathVariable Long id
    ) {
        transaccionService.eliminarTransaccion(id);
        return ResponseEntity.noContent().build();
    }
}