package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("registration/")
    public String registration(@RequestBody String registrationForm) {

        if(registrationForm.isEmpty()) {
            return "Registration form is empty";   
        }
        authService.registration(registrationForm);
        return registrationForm;
    }

}
