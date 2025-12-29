package org.pupille.backend.mysql.survey.exception;

public class UmfrageExpiredException extends RuntimeException {
    public UmfrageExpiredException(String message) {
        super(message);
    }
}
