package org.pupille.backend.mysql.survey.exception;

public class UmfrageNotFoundException extends RuntimeException {
    public UmfrageNotFoundException(String message) {
        super(message);
    }
}
