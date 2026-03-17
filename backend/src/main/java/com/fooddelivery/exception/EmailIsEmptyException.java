package com.fooddelivery.exception;

public class EmailIsEmptyException extends RuntimeException {
    public EmailIsEmptyException(String message) {
        super(message);
    }
}
