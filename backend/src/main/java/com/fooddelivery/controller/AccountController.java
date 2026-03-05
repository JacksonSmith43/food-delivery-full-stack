package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.UserProfileResponseDTO;
import com.fooddelivery.service.AccountService;

@Controller
@RestController
@RequestMapping("/api/user/account/")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {
    @Autowired
    AccountService accountService;

    @GetMapping("profile/{email}")
    ResponseEntity<UserProfileResponseDTO> getProfile(@PathVariable String email) {
        System.out.println("AccountController_getProfile().");

        UserProfileResponseDTO userProfile = accountService.getUserProfile(email);

        if (userProfile == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        System.out.println("AccountController_getProfile()_userProfile: " + userProfile);
        return ResponseEntity.ok(userProfile);
    }
}
