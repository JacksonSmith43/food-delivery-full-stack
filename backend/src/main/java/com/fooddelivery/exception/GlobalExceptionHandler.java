package com.fooddelivery.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotUserFoundException.class)
    // <String, Object>: code (the key) is a string and USER_NOT_FOUND is the value
    // and an
    // object because the message can be of any type.
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UsernameNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "code", "USER_NOT_FOUND",
                "message", exception.getMessage()));
    }

    @ExceptionHandler(AddressLabelAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleAddressLabelAlreadyExists(
            AddressLabelAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "code", "ADDRESS_LABEL_EXISTS",
                "message", exception.getMessage()));
    }

    @ExceptionHandler(PhoneNumberAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handlePhoneNumberAlreadyExists(
            PhoneNumberAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "code", "PHONE_NUMBER_EXISTS",
                "message", exception.getMessage()));
    }

    @ExceptionHandler(PhoneNumberEmptyException.class)
    public ResponseEntity<Map<String, Object>> handlePhoneNumberEmpty(
            PhoneNumberEmptyException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "code", "PHONE_NUMBER_EMPTY",
                "message", exception.getMessage()));
    }

    @ExceptionHandler(PostCodeIsEmptyOrNull.class)
    public ResponseEntity<Map<String, Object>> handlePostCodeIsEmptyOrNull(
            PostCodeIsEmptyOrNull exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "code", "POSTCODE_IS_EMPTY",
                "message", exception.getMessage()));
    }
}
