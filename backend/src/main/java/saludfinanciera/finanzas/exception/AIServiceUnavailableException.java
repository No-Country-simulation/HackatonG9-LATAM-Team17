package saludfinanciera.finanzas.exception;

public class AIServiceUnavailableException extends  RuntimeException {
    private final boolean isTimeout;

    public AIServiceUnavailableException(String message, boolean isTimeout) {
        super(message);
        this.isTimeout = isTimeout;
    }

    public boolean isTimeout() {
        return isTimeout;
    }
}
