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
 * 1. Envía los datos a Python para obtener el análisis y el resumen de gastos.
 * 2. Calcula el promedio de las 3 probabilidades devueltas por los modelos de IA.
 * 3. Compila el perfil financiero, la probabilidad promedio y recomendaciones finales para el Frontend.
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
        // PASO 1: SOLICITAR ANÁLISIS COMPLETO A LA IA (PYTHON)
        // =========================================================================
        RespuestaPythonDTO dsResponse = pythonClient.obtenerAnalisisDesdePython(input);

        // =========================================================================
        // PASO 2: CÁLCULO DEL PROMEDIO DE LAS TRES PROBABILIDADES
        // CORREGIDO: Se usa probabilidadRecomendaciones() con la ortografía correcta.
        // =========================================================================
        Double probabilidadPromedio = calcularPromedioProbabilidades(
                dsResponse.probabilidadCategoria(),
                dsResponse.probabilidadPerfilFinanciero(),
                dsResponse.probabilidadRecomendaciones()
        );

        // =========================================================================
        // PASO 3: OBTENER EL RESUMEN DE GASTOS DESDE PYTHON
        // CORREGIDO: Python ya nos entrega el resumen agrupado mediante resumenGastos()
        // =========================================================================
        Map<String, Double> resumenGastosPorCategoria = new HashMap<>();

        if (dsResponse.resumenGastos() != null && !dsResponse.resumenGastos().isEmpty()) {
            resumenGastosPorCategoria.putAll(dsResponse.resumenGastos());
        } else if (input.transacciones() != null) {
            // Fallback por seguridad si el mapa viniera vacío
            for (TransaccionDTO t : input.transacciones()) {
                resumenGastosPorCategoria.merge("Ocio", t.valor(), Double::sum);
            }
        }

        // =========================================================================
        // PASO 4: EXTRAER RECOMENDACIONES DE LA IA
        // Si Python devuelve nulo o una lista vacía, colocamos un mensaje genérico.
        // =========================================================================
        List<String> recomendaciones = dsResponse.recomendaciones();
        if (recomendaciones == null || recomendaciones.isEmpty()) {
            recomendaciones = List.of("Mantener un control regular de tus gastos.");
        }

        // =========================================================================
        // PASO 5: CONSTRUCCIÓN DEL PAQUETE FINAL PARA EL FRONTEND
        // =========================================================================
        return new AnalisisOutputDTO(
                dsResponse.perfilFinanciero(),
                probabilidadPromedio,
                resumenGastosPorCategoria,
                recomendaciones
        );
    }

    /**
     * Método auxiliar para calcular el promedio de las probabilidades de forma segura.
     * Omite valores nulos y previene divisiones por cero.
     */
    private Double calcularPromedioProbabilidades(Double... probs) {
        double suma = 0.0;
        int count = 0;

        for (Double p : probs) {
            if (p != null) {
                suma += p;
                count++;
            }
        }

        return count > 0 ? (suma / count) : 0.0;
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