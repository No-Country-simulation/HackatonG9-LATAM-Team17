package SaludFinanciera.finazas.DTOs;
//Esta clase representa cada uno de los gastos individuales que vienen en la lista.

import lombok.Data;

@Data
public class TransaccionDTO {
    private String descripcion;
    private double valor;
}