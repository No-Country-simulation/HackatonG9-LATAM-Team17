package saludfinanciera.finanzas.service;

import org.springframework.stereotype.Service;
import saludfinanciera.finanzas.client.PythonDataScienceClient;
import saludfinanciera.finanzas.dto.RespuestaPythonDTO;
import saludfinanciera.finanzas.dto.request.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.request.TransaccionDTO;
import saludfinanciera.finanzas.dto.response.AnalisisOutputDTO;
import saludfinanciera.finanzas.exception.ResourceNotFoundException;

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

        // Validar datos mínimos de entrada
        if (input == null || input.transacciones() == null || input.transacciones().isEmpty()) {
            throw new ResourceNotFoundException("No se proporcionaron transacciones válidas para realizar el análisis.");
        }

        // 1. SOLICITAR ANÁLISIS AL SERVICIO DE PYTHON
        RespuestaPythonDTO dsResponse = pythonClient.obtenerAnalisisDesdePython(input);

        if (dsResponse == null) {
            throw new ResourceNotFoundException("No se pudo obtener una respuesta válida del motor de análisis.");
        }

        // 2. CÁLCULO DEL PROMEDIO DE PROBABILIDADES
        Double probabilidadPromedio = calcularPromedioProbabilidades(
                dsResponse.probabilidadCategoria(),
                dsResponse.probabilidadPerfilFinanciero(),
                dsResponse.probabilidadRecomendaciones()
        );

        // 3. OBTENER RESUMEN DE GASTOS
        Map<String, Double> resumenGastosPorCategoria = new HashMap<>();

        if (dsResponse.resumenGastos() != null && !dsResponse.resumenGastos().isEmpty()) {
            resumenGastosPorCategoria.putAll(dsResponse.resumenGastos());
        } else {
            // Fallback por seguridad
            for (TransaccionDTO t : input.transacciones()) {
                resumenGastosPorCategoria.merge("Ocio", t.valor(), Double::sum);
            }
        }

        // 4. EXTRAER RECOMENDACIONES
        List<String> recomendaciones = dsResponse.recomendaciones();
        if (recomendaciones == null || recomendaciones.isEmpty()) {
            recomendaciones = List.of("Mantener un control regular de tus gastos.");
        }

        // 5. CONSTRUCCIÓN Y RETORNO DEL DTO FINAL
        return new AnalisisOutputDTO(
                dsResponse.perfilFinanciero(),
                probabilidadPromedio,
                resumenGastosPorCategoria,
                recomendaciones
        );
    }

    /**
     * CLASIFICACIÓN INDIVIDUAL DE UNA TRANSACCIÓN
     */
    public RespuestaPythonDTO clasificarTransaccion(TransaccionDTO transaccionDTO) {
        if (transaccionDTO == null) {
            throw new ResourceNotFoundException("Los datos de la transacción no pueden ser nulos.");
        }

        RespuestaPythonDTO respuesta = pythonClient.obtenerClasificacionDesdePython(transaccionDTO);

        if (respuesta == null) {
            throw new ResourceNotFoundException("No se obtuvo respuesta para la clasificación de la transacción.");
        }

        return respuesta;
    }

    /**
     * Funcion auxiliar para calcular el promedio de probabilidades.
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
}