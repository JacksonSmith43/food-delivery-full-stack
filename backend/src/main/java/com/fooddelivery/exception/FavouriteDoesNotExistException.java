package com.fooddelivery.exception;

public class FavouriteDoesNotExistException extends RuntimeException {
    public FavouriteDoesNotExistException(String message) {
        super(message);
    }
}
