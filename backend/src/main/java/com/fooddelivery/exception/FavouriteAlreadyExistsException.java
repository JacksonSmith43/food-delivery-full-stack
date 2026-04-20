package com.fooddelivery.exception;

public class FavouriteAlreadyExistsException extends RuntimeException {
    public FavouriteAlreadyExistsException(String message) {
        super(message);
    }
}
