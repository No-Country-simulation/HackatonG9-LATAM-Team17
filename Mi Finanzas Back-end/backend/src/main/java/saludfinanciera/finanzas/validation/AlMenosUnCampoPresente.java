package saludfinanciera.finanzas.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AlMenosUnCampoPresenteValidator.class)
public @interface AlMenosUnCampoPresente {
    String message() default "Debes enviar al menos el nombre o el email a actualizar.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}