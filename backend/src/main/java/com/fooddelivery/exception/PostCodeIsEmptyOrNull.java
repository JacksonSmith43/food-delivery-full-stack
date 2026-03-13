package com.fooddelivery.exception;

public class PostCodeIsEmptyOrNull extends RuntimeException {
    public PostCodeIsEmptyOrNull(String message) {
        super(message);
    }
}
