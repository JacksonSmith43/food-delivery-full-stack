package com.fooddelivery.exception;

public class NotUserFoundException extends RuntimeException {
    public NotUserFoundException(String message) {
        super(message);
    }
}
