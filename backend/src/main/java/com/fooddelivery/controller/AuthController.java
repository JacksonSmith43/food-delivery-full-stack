package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.entity.Auth;
import com.fooddelivery.repository.AuthRepository;
import com.fooddelivery.service.AuthService;

@Controller
@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private AuthRepository authRepository;

    @PostMapping("registration/{email}")
    public ResponseEntity<String> registration(@PathVariable String email, @RequestBody String password) {
        System.out.println("AuthController_registration().");
        try {

            if (email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is empty.");
            }
            authService.registration(email, password);
            return ResponseEntity.status(HttpStatus.CREATED).body("Registration successful: " + email);

        } catch (Exception e) {
            System.err.println("AuthController_registration()_Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("AuthController_registration() failed: " + e.getMessage());
        }
    }

    @PostMapping("login/{email}")
    public ResponseEntity<String> login(@PathVariable String email, @RequestBody String password) {
        System.out.println("AuthController_login().");
        try {

            List<Auth> emailExists = authRepository.findByEmail(email);
            List<Auth> passwordExists = authRepository.findByPassword(password);

            if (emailExists.isEmpty()) {
                System.out.println("AuthController_login(): Email not found: " + email);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Incorrect Email.");
            }

            if (passwordExists.isEmpty()) {
                System.out.println("AuthController_login(): Password not found for email: " + email);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Incorrect Password.");
            }
            System.out.println("AuthController_login(): Login successful for email: " + email);
            return ResponseEntity.status(HttpStatus.OK).body("Login successful: " + email);

        } catch (Exception e) {
            System.err.println("AuthController_login()_Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("AuthController_login() failed: " + e.getMessage());
        }

    }

    @PostMapping("emailChange/{currentEmail}")
    public ResponseEntity<String> changeEmail(@PathVariable String currentEmail, @RequestBody String newEmail) {
        System.out.println("AuthController_changeEmail().");
        try {

            if (newEmail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Email is empty.");
            }

            boolean validEmail = authService.changeEmail(currentEmail, newEmail);

            if (validEmail) {
                return ResponseEntity.status(HttpStatus.OK).body("Email change successful.");

            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("This email address already exists.");
            }

        } catch (Exception e) {
            System.err.println("AuthController_changeEmail()_Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("AuthController_changeEmail() failed: " + e.getMessage());
        }
    }

    @PostMapping("passwordChange/{currentPassword}")
    public ResponseEntity<String> changePassword(@PathVariable String currentPassword,
            @RequestBody String newPassword) {
        System.out.println("AuthController_changePassword().");

        try {
            List<Auth> passwordCurrent = authRepository.findByPassword(currentPassword);
            List<Auth> passwordNew = authRepository.findByPassword(newPassword);

            if (passwordCurrent.isEmpty()) {
                System.out.println("AuthController_changePassword()_Current password could not be found.");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Current password could not be found.");
            }

            if (!passwordNew.isEmpty()) {
                System.out.println("AuthController_changePassword()_New password already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body("New password already exists.");
            }

            boolean validPassword = authService.changePassword(currentPassword, newPassword);

            if (validPassword) {
                return ResponseEntity.status(HttpStatus.OK).body("The password has successfully been changed.");

            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("This password already exists or is invalid.");
            }

        } catch (Exception e) {
            System.err.println("AuthController_changePassword()_Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("AuthController_changePassword() failed: " + e.getMessage());
        }
    }

}
