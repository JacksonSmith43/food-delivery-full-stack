package com.fooddelivery.exception;

public class PhoneNumberEmptyException extends RuntimeException {
    public PhoneNumberEmptyException(String message) {
        super(message);
    }
}
