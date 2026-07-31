package saludfinanciera.finanzas.exception;

public class EntityAlreadyExistsException extends  RuntimeException {
    public EntityAlreadyExistsException(String message) {
        super(message);
    }
}
