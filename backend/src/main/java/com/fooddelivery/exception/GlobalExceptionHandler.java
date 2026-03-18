package com.fooddelivery.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
        @ExceptionHandler(UserNotFoundException.class)
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

        @ExceptionHandler(AddressDoesNotAlreadyExistException.class)
        public ResponseEntity<Map<String, Object>> handleAddressDoesNotAlreadyExist(
                        AddressDoesNotAlreadyExistException exception) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                                "code", "ADDRESS_DOES_NOT_ALREADY_EXIST",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<Map<String, Object>> handleEmailAlreadyExists(
                        EmailAlreadyExistsException exception) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                                "code", "EMAIL_ALREADY_EXIST",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(EmailDoesNotExistException.class)
        public ResponseEntity<Map<String, Object>> handleEmailDoesNotExist(
                        EmailDoesNotExistException exception) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                                "code", "EMAIL_DOES_NOT_EXIST",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(PasswordDoesNotExistException.class)
        public ResponseEntity<Map<String, Object>> handlePasswordDoesNotExist(
                        PasswordDoesNotExistException exception) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                                "code", "PASSWORD_DOES_NOT_EXIST",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(EmailIsEmptyException.class)
        public ResponseEntity<Map<String, Object>> handleEmailIsEmpty(
                        EmailIsEmptyException exception) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                                "code", "EMAIL_IS_EMPTY",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(InvalidCurrentPasswordException.class)
        public ResponseEntity<Map<String, Object>> handleInvalidCurrentPassword(
                        InvalidCurrentPasswordException exception) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                                "code", "INVALID_CURRENT_PASSWORD",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(SameAsCurrentPasswordException.class)
        public ResponseEntity<Map<String, Object>> handleSameAsCurrentPassword(
                        SameAsCurrentPasswordException exception) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                                "code", "SAME_AS_CURRENT_PASSWORD",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(PasswordIsEmptyException.class)
        public ResponseEntity<Map<String, Object>> handlePasswordIsEmpty(
                        PasswordIsEmptyException exception) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                                "code", "PASSWORD_IS_EMPTY",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(IncorrectCurrentPasswordException.class)
        public ResponseEntity<Map<String, Object>> handleIncorrectCurrentPassword(
                        IncorrectCurrentPasswordException exception) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                                "code", "INCORRECT_CURRENT_PASSWORD",
                                "message", exception.getMessage()));
        }

        @ExceptionHandler(PhoneNumberInputIsNullException.class)
        public ResponseEntity<Map<String, Object>> handleNullPhoneNumberInput(
                        PhoneNumberInputIsNullException exception) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                                "code", "PHONE_NUMBER_INPUT_NULL",
                                "message", exception.getMessage()));
        }

}
