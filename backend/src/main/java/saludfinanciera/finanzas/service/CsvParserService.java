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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParserService {

    private static final List<DateTimeFormatter> DATE_FORMATTERS = List.of(
            DateTimeFormatter.ISO_LOCAL_DATE,                 // yyyy-MM-dd
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),        // dd/MM/yyyy
            DateTimeFormatter.ofPattern("dd-MM-yyyy")         // dd-MM-yyyy
    );

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
                String fechaStr = obtenerCampoSeguro(record, "fecha");
                String descripcion = obtenerCampoSeguro(record, "descripcion");
                String montoStr = obtenerCampoSeguro(record, "monto");
                String categoria = obtenerCampoSeguro(record, "categoria");

                if (!montoStr.isBlank() && !descripcion.isBlank()) {
                    LocalDate fecha = parsearFecha(fechaStr);
                    BigDecimal monto = new BigDecimal(montoStr.replace("$", "").replace(",", ".").trim());

                    // Si la categoría viene vacía en el CSV, se envía null para que Python NLP la categorice
                    String categoriaFinal = categoria.isBlank() ? null : categoria.trim().toUpperCase();

                    transacciones.add(new TransaccionItemDTO(fecha, descripcion, monto, categoriaFinal));
                }
            }

        } catch (Exception e) {
            throw new CsvProcessingException("Error al procesar el archivo CSV. Verifica las columnas (fecha, descripcion, monto, categoria).", e);
        }

        return transacciones;
    }

    private String obtenerCampoSeguro(CSVRecord record, String nombreColumna) {
        return record.isMapped(nombreColumna) && record.get(nombreColumna) != null
                ? record.get(nombreColumna).trim()
                : "";
    }

    private LocalDate parsearFecha(String fechaStr) {
        if (fechaStr.isBlank()) {
            return LocalDate.now();
        }
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(fechaStr, formatter);
            } catch (DateTimeParseException ignored) {
                // Intenta con el siguiente formato
            }
        }
        throw new IllegalArgumentException("Formato de fecha no soportado en CSV: " + fechaStr);
    }
}