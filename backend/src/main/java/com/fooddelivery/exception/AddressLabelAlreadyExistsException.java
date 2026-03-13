package com.fooddelivery.exception;

public class AddressLabelAlreadyExistsException extends RuntimeException {
    public AddressLabelAlreadyExistsException(String message) {
        super(message);
    }
}
