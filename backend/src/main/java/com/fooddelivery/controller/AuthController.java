package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

}
