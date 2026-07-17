package SaludFinanciera.finazas.services;
//christian importante!!! esta regla de negocios si o si se cambia para un formato mas
//simple mientras definimos las variables.

import SaludFinanciera.finazas.DTOs.AnalisisInputDTO;
import SaludFinanciera.finazas.DTOs.AnalisisOutputDTO;
import SaludFinanciera.finazas.DTOs.TransaccionDTO;
import SaludFinanciera.finazas.models.AnalisisFinanciero;
import SaludFinanciera.finazas.models.Transaccion;
import SaludFinanciera.finazas.repositories.AnalisisRepository;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisService {

    private final AnalisisRepository analisisRepository;

    public AnalisisService(AnalisisRepository analisisRepository) {
        this.analisisRepository = analisisRepository;
    }

    public AnalisisOutputDTO procesarAnalisis(AnalisisInputDTO input) {
        Map<String, Double> resumenGastos = new HashMap<>();
        List<Transaccion> entidadesTransacciones = new ArrayList<>();
        double totalGastos = 0;

        // Cambiado a .getTransacciones() por Lombok
        for (TransaccionDTO tDto : input.getTransacciones()) {
            String categoriaCalculada = "Otros";

            // Cambiado a .getDescripcion() y .getValor() por Lombok
            String descripcionLower = tDto.getDescripcion().toLowerCase();
            if (descripcionLower.contains("arriendo") || descripcionLower.contains("servicio")) {
                categoriaCalculada = "Vivienda";
            } else if (descripcionLower.contains("cine") || descripcionLower.contains("restaurante")) {
                categoriaCalculada = "Ocio";
            }

            resumenGastos.put(categoriaCalculada, resumenGastos.getOrDefault(categoriaCalculada, 0.0) + tDto.getValor());
            totalGastos += tDto.getValor();

            Transaccion transaccionDb = new Transaccion();
            transaccionDb.setDescripcion(tDto.getDescripcion());
            transaccionDb.setValor(tDto.getValor());
            transaccionDb.setCategoria_asignada(categoriaCalculada);
            entidadesTransacciones.add(transaccionDb);
        }

        String perfil = "Estable";
        double probabilidad = 0.85;
        List<String> recomendaciones = new ArrayList<>();

        // Cambiado a .getNivel_endeudamiento() e .getIngreso_mensual() por Lombok
        if (input.getNivel_endeudamiento() > 50 || totalGastos > input.getIngreso_mensual()) {
            perfil = "Riesgo Alto";
            probabilidad = 0.92;
            recomendaciones.add("Alerta: Tus gastos u obligaciones superan el límite saludable de tus ingresos mensuales.");
            recomendaciones.add("Recomendación: Reestructura tus deudas de inmediato y recorta suscripciones de ocio.");
        } else {
            recomendaciones.add("Vas por buen camino. Sigue manteniendo tu nivel de endeudamiento controlado.");
            recomendaciones.add("Considera automatizar un porcentaje de ahorro al inicio del mes.");
        }

        AnalisisFinanciero analisisDb = new AnalisisFinanciero();
        analisisDb.setIngreso_mensual(input.getIngreso_mensual());
        analisisDb.setNivel_endeudamiento(input.getNivel_endeudamiento());
        analisisDb.setFrecuencia_ahorro(input.getFrecuencia_ahorro());
        analisisDb.setPerfil_financiero(perfil);
        analisisDb.setProbabilidad_ia(probabilidad);
        analisisDb.setTransacciones(entidadesTransacciones);
        analisisDb.setRecomendaciones(recomendaciones);

        analisisRepository.save(analisisDb);

        // Crear el DTO de salida usando el constructor tradicional de Lombok
        AnalisisOutputDTO output = new AnalisisOutputDTO();
        output.setPerfil_financiero(perfil);
        output.setProbabilidad(probabilidad);
        output.setResumen_gastos(resumenGastos);
        output.setRecomendaciones(recomendaciones);

        return output;
    }
}