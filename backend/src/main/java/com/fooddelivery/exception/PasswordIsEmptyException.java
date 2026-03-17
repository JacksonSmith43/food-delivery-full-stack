package com.fooddelivery.exception;

public class PasswordIsEmptyException extends RuntimeException {
    public PasswordIsEmptyException(String message) {
        super(message);
    }
}
