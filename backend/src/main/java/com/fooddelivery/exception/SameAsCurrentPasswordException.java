package com.fooddelivery.exception;

public class SameAsCurrentPasswordException extends RuntimeException {
    public SameAsCurrentPasswordException(String message) {
        super(message);
    }
}
