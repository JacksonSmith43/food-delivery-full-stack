package com.fooddelivery.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.fooddelivery.dto.LoginRequest;
import com.fooddelivery.dto.PasswordChangeRequest;
import com.fooddelivery.exception.EmailDoesNotExistException;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.AuthService;

import jakarta.servlet.http.HttpSession;

@Controller
@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private static final String AUTH_USER_EMAIL = "authUserEmail";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("registration/{email}")
    public ResponseEntity<String> registration(@PathVariable String email, @RequestBody String password) {
        System.out.println("AuthController_registration().");

        authService.registration(email, password);

        return ResponseEntity.status(HttpStatus.CREATED).body("Registration successful: " + email);
    }

    @PostMapping("login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        System.out.println("AuthController_login().");

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (!authService.emailExists(email)) {
            System.out.println("AuthController_login(): Email not found: " + email);
            throw new EmailDoesNotExistException("Incorrect Email.");
        }

        authService.checksCurrentPasswordIsValid(email, password);

        User user = authService.getUserByEmail(email);
        session.setAttribute(AUTH_USER_EMAIL, user.getEmail());

        System.out.println("AuthController_login(): Login successful for email: " + email);
        return ResponseEntity.status(HttpStatus.OK).body(new User(user.getId(), user.getEmail(), ""));
    }

    @GetMapping("me")
    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        System.out.println("AuthController_getCurrentUser().");

        String email = getAuthenticatedEmail(session);
        User user = authService.getUserByEmail(email);

        return ResponseEntity.ok(new User(user.getId(), user.getEmail(), ""));
    }

    @PostMapping("logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        System.out.println("AuthController_logout().");

        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @PostMapping("emailChange")
    public ResponseEntity<String> changeEmail(@RequestBody String newEmail, HttpSession session) {
        System.out.println("AuthController_changeEmail().");

        String currentEmail = getAuthenticatedEmail(session);

        authService.changeEmail(currentEmail, newEmail);
        session.setAttribute(AUTH_USER_EMAIL, newEmail);

        return ResponseEntity.status(HttpStatus.OK).body("Email change successful.");
    }

    @PostMapping("passwordChange/")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request, HttpSession session) {
        System.out.println("AuthController_changePassword().");

        String email = getAuthenticatedEmail(session);
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();

        authService.comparesNewPasswordWithCurrentPassword(currentPassword, newPassword);
        authService.changePassword(email, currentPassword, newPassword);

        return ResponseEntity.status(HttpStatus.OK)
                .body("The password has successfully been changed. New password: " + newPassword);
    }

    private String getAuthenticatedEmail(HttpSession session) {
        Object email = session.getAttribute(AUTH_USER_EMAIL);

        if (email instanceof String authenticatedEmail && !authenticatedEmail.isBlank()) {
            return authenticatedEmail;
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated.");
    }

}
