package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.dto.PasswordChangeRequest;
import com.fooddelivery.exception.EmailDoesNotExistException;
import com.fooddelivery.service.AuthService;

@Controller
@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("registration/{email}")
    public ResponseEntity<String> registration(@PathVariable String email, @RequestBody String password) {
        System.out.println("AuthController_registration().");

        authService.registration(email, password);

        return ResponseEntity.status(HttpStatus.CREATED).body("Registration successful: " + email);
    }

    @PostMapping("login/{email}")
    public ResponseEntity<String> login(@PathVariable String email, @RequestBody String password) {
        System.out.println("AuthController_login().");

        if (!authService.emailExists(email)) {
            System.out.println("AuthController_login(): Email not found: " + email);
            throw new EmailDoesNotExistException("Incorrect Email.");
        }

        authService.checksCurrentPasswordIsValid(email, password);

        System.out.println("AuthController_login(): Login successful for email: " + email);
        return ResponseEntity.status(HttpStatus.OK).body("Login successful: " + email);
    }

    @PostMapping("emailChange/{currentEmail}")
    public ResponseEntity<String> changeEmail(@PathVariable String currentEmail, @RequestBody String newEmail) {
        System.out.println("AuthController_changeEmail().");

        authService.changeEmail(currentEmail, newEmail);

        return ResponseEntity.status(HttpStatus.OK).body("Email change successful.");
    }

    @PostMapping("passwordChange/")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
        System.out.println("AuthController_changePassword().");

        String email = request.getEmail();
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();

        authService.comparesNewPasswordWithCurrentPassword(email, currentPassword);
        authService.changePassword(email, currentPassword, newPassword);

        return ResponseEntity.status(HttpStatus.OK)
                .body("The password has successfully been changed. New password: " + newPassword);
    }

}
