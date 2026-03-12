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

    @PostMapping("profile/addAddress/{email}")
    ResponseEntity<AddressDTO> addAddress(@PathVariable String email, @RequestBody Address address) {
        System.out.println("AccountController_addAddress().");

        Address userAddress = accountService.addAddress(address, email);

        if (userAddress == null) {
            System.out.println("AccountController_addAddress()_The user does not exist.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        AddressDTO dto = new AddressDTO(
                userAddress.getId(),
                userAddress.getLabel(),
                userAddress.getStreetName(),
                userAddress.getPostalCode() == null ? null : Integer.valueOf(userAddress.getPostalCode()),
                userAddress.getCity(),
                userAddress.getCountry());

        System.out.println("AccountController_addAddress()_Successful address addition.");
        return ResponseEntity.ok(dto);
    }

    @PostMapping("profile/changePhoneNumber/{email}")
    ResponseEntity<String> changePhoneNumber(@PathVariable String email, @RequestBody String phoneNumber) {
        System.out.println("AccountController_changePhoneNumber().");

        try {

            if (phoneNumber.isEmpty()) {
                System.out.println("AccountController_changePhoneNumber()_Phone number is empty.");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }

            boolean validPhoneNumber = accountService.changePhoneNumber(phoneNumber, email);

            if (validPhoneNumber) {
                System.out.println("AccountController_changePhoneNumber()_Successful phone number change.");
                return ResponseEntity.ok(phoneNumber);

            } else if (validPhoneNumber == false) {
                System.out.println("AccountController_changePhoneNumber()_The phone number is invalid/already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("The phone number is invalid or already exists.");
            } else {
                System.out.println("AccountController_changePhoneNumber()_The user does not exist.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user does not exist.");
            }

        } catch (Exception e) {
            System.out.println("AccountController_changePhoneNumber()_An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }
}
