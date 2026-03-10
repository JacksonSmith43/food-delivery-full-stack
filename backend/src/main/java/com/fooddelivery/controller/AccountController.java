package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.UserProfileResponseDTO;
import com.fooddelivery.entity.Address;
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

    @PostMapping("profile/changeOrAddAddress/{email}")
    ResponseEntity<AddressDTO> changeOrAddAddress(@PathVariable String email, @RequestBody Address address) {
        System.out.println("AccountController_changeOrAddAddress().");

        Address userAddress = accountService.changeOrAddAddress(address, email);

        if (userAddress == null) {
            System.out.println("AccountController_changeOrAddAddress()_The user does not exist.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        AddressDTO dto = new AddressDTO(
            userAddress.getId(),
            userAddress.getLabel(),
            userAddress.getStreetName(),
            userAddress.getPostalCode() == null ? null : Integer.valueOf(userAddress.getPostalCode()),
            userAddress.getCity(),
            userAddress.getCountry()
        );

        System.out.println("AccountController_changeOrAddAddress()_Successful address change/addition.");
        return ResponseEntity.ok(dto);
    }
}
