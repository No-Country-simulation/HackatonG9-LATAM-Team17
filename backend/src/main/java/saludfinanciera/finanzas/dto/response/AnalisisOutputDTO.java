package saludfinanciera.finanzas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalisisOutputDTO{
    private String estadoFinanciero;
    private String diagnostico;
    private List<String> tips;
}