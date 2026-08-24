package saludfinanciera.finanzas.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import saludfinanciera.finanzas.dto.request.ActualizarUsuarioRequestDTO;

public class AlMenosUnCampoPresenteValidator
        implements ConstraintValidator<AlMenosUnCampoPresente, ActualizarUsuarioRequestDTO> {
    @Override
    public boolean isValid(ActualizarUsuarioRequestDTO dto, ConstraintValidatorContext ctx) {
        if (dto == null) return false;
        boolean nombrePresente = dto.nombre() != null && !dto.nombre().isBlank();
        boolean emailPresente = dto.email() != null && !dto.email().isBlank();
        return nombrePresente || emailPresente;
    }
}