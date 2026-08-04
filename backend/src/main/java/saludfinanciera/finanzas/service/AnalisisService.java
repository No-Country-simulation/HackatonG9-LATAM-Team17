package saludfinanciera.finanzas.service;

import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.client.PythonDataScienceClient;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SERVICIO DE ANÁLISIS FINANCIERO
 *
 * Actúa como orquestador del sistema:
 * 1. Envía los gastos individuales a Python para que los clasifique en las 7 categorías
 *    (Alimentación, Transporte, Salud, Vivienda, Educación, Ocio, Servicios).
 * 2. Suma los valores en Java para armar el 'resumen_gastos' agrupado por categoría.
 * 3. Compila el perfil financiero, certidumbre y recomendaciones finales para el Frontend.
 */
@Service
public class AnalisisService {

    // Cliente HTTP para conectarse con el microservicio de FastAPI / Python
    private final PythonDataScienceClient pythonClient;

    /**
     * Inyección de dependencias por constructor (Buena práctica en Spring)
     */
    public AnalisisService(PythonDataScienceClient pythonClient) {
        this.pythonClient = pythonClient;
    }

    /**
     * PROCESO PRINCIPAL: Procesa el análisis de finanzas personales.
     *
     * @param input Objeto con ingresoMensual, nivelEndeudamiento, frecuenciaAhorro y la lista de transacciones.
     * @return AnalisisOutputDTO listo para enviarse como JSON al Frontend.
     */
    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO input) {

        // =========================================================================
        // PASO 1: SOLICITAR CLASIFICACIÓN Y EVALUACIÓN A LA IA (PYTHON)
        // Se le envían las transacciones crudas (ej: "almuerzo", "gasolina", "moto")
        // Python nos devuelve un mapa con la asignación a las 7 categorías oficiales:
        // Ej: {"almuerzo": "Alimentación", "gasolina": "Transporte", "moto": "Transporte"}
        // =========================================================================
        RespuestaPythonDTO dsResponse = pythonClient.obtenerAnalisisDesdePython(input);

        // Extraemos el mapa asignado por la IA en Python
        Map<String, String> clasificacionPython = dsResponse.categoria();


        // =========================================================================
        // PASO 2: MATEMÁTICAS EN JAVA (ACUMULACIÓN POR CATEGORÍA)
        // Recorremos las transacciones del usuario y sumamos los montos según
        // la categoría que le asignó Python.
        // =========================================================================
        Map<String, Double> resumenGastosPorCategoria = new HashMap<>();

        if (input.transacciones() != null) {
            for (TransaccionDTO t : input.transacciones()) {

                // Buscamos qué categoría le asignó Python a esta descripción.
                // Si por alguna razón no la encuentra, se clasifica en "Ocio" por defecto.
                String categoria = "Ocio";
                if (clasificacionPython != null && clasificacionPython.containsKey(t.descripcion())) {
                    categoria = clasificacionPython.get(t.descripcion());
                }

                // Sumamos el valor a la categoría correspondiente
                // Ejemplo:
                // - "Alimentación": 100 (almuerzo) + 100 (comida) = 200.0
                // - "Transporte":  200 (gasolina) + 400 (moto)    = 600.0
                resumenGastosPorCategoria.merge(categoria, t.valor(), Double::sum);
            }
        }


        // =========================================================================
        // PASO 3: EXTRAER RECOMENDACIONES DE LA IA
        // Leemos las sugerencias generadas por Python.
        // Si Python devuelve nulo o una lista vacía, colocamos un mensaje genérico.
        // =========================================================================
        List<String> recomendaciones = dsResponse.recomendaciones();
        if (recomendaciones == null || recomendaciones.isEmpty()) {
            recomendaciones = List.of("Mantener un control regular de tus gastos.");
        }


        // =========================================================================
        // PASO 4: CONSTRUCCIÓN DEL PAQUETE FINAL PARA EL FRONTEND
        // Retornamos el DTO que enviará el JSON estructurado:
        // - perfilFinanciero: generado por Python
        // - probabilidad: generada por Python
        // - resumenGastosPorCategoria: calculated por Java acumulando las 7 categorías
        // - recomendaciones: generadas por Python
        // =========================================================================
        return new AnalisisOutputDTO(
                dsResponse.perfilFinanciero(),
                dsResponse.probabilidad(),
                resumenGastosPorCategoria,
                recomendaciones
        );
    }

    /**
     * CLASIFICACIÓN INDIVIDUAL DE UNA TRANSACCIÓN
     * Utilizado por el Controlador para procesar o validar un gasto de forma independiente.
     *
     * @param transaccionDTO Objeto con la descripción y el valor de un solo gasto.
     * @return RespuestaPythonDTO enviada desde el cliente de Python.
     */
    public RespuestaPythonDTO clasificarTransaccion(TransaccionDTO transaccionDTO) {
        return pythonClient.obtenerClasificacionDesdePython(transaccionDTO);
    }
}