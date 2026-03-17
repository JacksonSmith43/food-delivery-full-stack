package com.fooddelivery.exception;

public class PasswordDoesNotExistException extends RuntimeException {
    public PasswordDoesNotExistException(String message) {
        super(message);
    }
}
