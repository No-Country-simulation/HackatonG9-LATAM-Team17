package saludfinanciera.finanzas.service;
//christian importante!!! esta regla de negocios si o si se cambia para un formato mas
//simple mientras definimos las variables.

import saludfinanciera.finanzas.dto.AnalisisInputDTO;
import saludfinanciera.finanzas.dto.AnalisisOutputDTO;
import saludfinanciera.finanzas.dto.TransaccionDTO;
import saludfinanciera.finanzas.model.AnalisisFinanciero;
import saludfinanciera.finanzas.model.Transaccion;
import saludfinanciera.finanzas.repository.AnalisisFinancieroRepository;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisService {

    private final AnalisisFinancieroRepository analisisRepository;

    public AnalisisService(AnalisisFinancieroRepository analisisRepository) {
        this.analisisRepository = analisisRepository;
    }

    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO input) {
        Map<String, Double> resumenGastos = new HashMap<>();
        List<Transaccion> entidadesTransacciones = new ArrayList<>();
        double totalGastos = 0;

        // Cambiado a .getTransacciones() por Lombok
        for (TransaccionDTO tDto : input.transacciones()) {
            String categoriaCalculada = "Otros";

            // Cambiado a .getDescripcion() y .getValor() por Lombok
            String descripcionLower = tDto.descripcion().toLowerCase();
            if (descripcionLower.contains("arriendo") || descripcionLower.contains("servicio")) {
                categoriaCalculada = "Vivienda";
            } else if (descripcionLower.contains("cine") || descripcionLower.contains("restaurante")) {
                categoriaCalculada = "Ocio";
            }

            resumenGastos.put(categoriaCalculada, resumenGastos.getOrDefault(categoriaCalculada, 0.0) + tDto.valor());
            totalGastos += tDto.valor();

            // Mapeo a la entidad de Base de Datos (Setters con CamelCase)
            Transaccion transaccionDb = new Transaccion();
            transaccionDb.setDescripcion(tDto.descripcion());
            transaccionDb.setValor(tDto.valor());
            transaccionDb.setCategoriaAsignada(categoriaCalculada);
            entidadesTransacciones.add(transaccionDb);
        }

        String perfil = "Estable";
        double probabilidad = 0.85;
        List<String> recomendaciones = new ArrayList<>();

        // 2. Regla de negocio usando los métodos del Record input en camelCase
        if (input.nivelEndeudamiento() > 50 || totalGastos > input.ingresoMensual()) {
            perfil = "Riesgo Alto";
            probabilidad = 0.92;
            recomendaciones.add("Alerta: Tus gastos u obligaciones superan el límite saludable de tus ingresos mensuales.");
            recomendaciones.add("Recomendación: Reestructura tus deudas de inmediato y recorta suscripciones de ocio.");
        } else {
            recomendaciones.add("Vas por buen camino. Sigue manteniendo tu nivel de endeudamiento controlado.");
            recomendaciones.add("Considera automatizar un porcentaje de ahorro al inicio del mes.");
        }

        AnalisisFinanciero analisisDb = new AnalisisFinanciero();
        analisisDb.setIngresoMensual(input.ingresoMensual());
        analisisDb.setNivelEndeudamiento(input.nivelEndeudamiento());
        analisisDb.setFrecuenciaAhorro(input.frecuenciaAhorro());
        analisisDb.setPerfilFinanciero(perfil);
        analisisDb.setProbabilidadIa(probabilidad);
        analisisDb.setTransacciones(entidadesTransacciones);
        analisisDb.setRecomendaciones(recomendaciones);

        analisisRepository.save(analisisDb);

        return new AnalisisOutputDTO(
                perfil,
                probabilidad,
                resumenGastos,
                recomendaciones
        );
    }
}