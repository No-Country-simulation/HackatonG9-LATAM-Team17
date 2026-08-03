package saludfinanciera.finanzas.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import saludfinanciera.finanzas.dto.request.TransaccionItemDTO;
import saludfinanciera.finanzas.exception.CsvProcessingException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParserService {

    public List<TransaccionItemDTO> parsearTransacciones(MultipartFile file) {
        List<TransaccionItemDTO> transacciones = new ArrayList<>();

        if (file == null || file.isEmpty()) {
            return transacciones;
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            // Configuración resiliente: Tolera mayúsculas/minúsculas y espacios en cabeceras
            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setIgnoreSurroundingSpaces(true)
                    .build();

            CSVParser csvParser = new CSVParser(reader, format);

            for (CSVRecord record : csvParser) {
                String fecha = obtenerCampoSeguro(record, "fecha");
                String descripcion = obtenerCampoSeguro(record, "descripcion");
                String montoStr = obtenerCampoSeguro(record, "monto");

                // Normalización de la categoría
                String categoria = normalizarCategoria(record);

                if (montoStr != null && !montoStr.isBlank()) {
                    // Sanitiza por si viene con formato de moneda o coma decimal
                    BigDecimal monto = new BigDecimal(montoStr.replace("$", "").replace(",", ".").trim());
                    transacciones.add(new TransaccionItemDTO(fecha, descripcion, monto, categoria));
                }
            }

        } catch (Exception e) {
            // Lanza excepción manejable por el ControllerAdvice
            throw new CsvProcessingException("Error al procesar el archivo CSV. Verifica el formato de las columnas (fecha, descripcion, monto, categoria).", e);
        }

        return transacciones;
    }

    private String obtenerCampoSeguro(CSVRecord record, String nombreColumna) {
        return record.isMapped(nombreColumna) ? record.get(nombreColumna).trim() : "";
    }

    // Nueva forma  helper para sanitizar la categoría
    private String normalizarCategoria(CSVRecord record) {
        if (!record.isMapped("categoria") || record.get("categoria") == null) {
            return "OTROS";
        }

        String valor = record.get("categoria").trim();
        return valor.isBlank() ? "OTROS" : valor.toUpperCase();
    }
}