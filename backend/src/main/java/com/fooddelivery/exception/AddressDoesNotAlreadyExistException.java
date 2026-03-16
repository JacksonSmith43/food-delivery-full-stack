package com.fooddelivery.exception;

public class AddressDoesNotAlreadyExistException extends RuntimeException {
    public AddressDoesNotAlreadyExistException(String message) {
        super(message);
    }
}
