package com.fooddelivery.exception;

public class MenuItemDoesNotExistException extends RuntimeException {
    public MenuItemDoesNotExistException(String message) {
        super(message);
    }
}
