package com.fooddelivery.exception;

public class IncorrectCurrentPasswordException extends RuntimeException {
    public IncorrectCurrentPasswordException(String message) {
        super(message);
    }
}
