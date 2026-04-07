package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

        System.out.println("AccountController_getProfile()_userProfile_email: " + email);
        return ResponseEntity.ok(accountService.getUserProfile(email));
    }

    @PostMapping("profile/addAddress/{email}")
    ResponseEntity<AddressDTO> addAddress(@PathVariable String email, @RequestBody Address address) {
        System.out.println("AccountController_addAddress().");

        Address userAddress = accountService.addAddress(address, email);

        AddressDTO dto = addressDTOMapping(userAddress);

        System.out.println("AccountController_addAddress()_Successful address addition.");
        return ResponseEntity.ok(dto);
    }

    @PostMapping("profile/changePhoneNumber/{email}")
    ResponseEntity<String> changePhoneNumber(@PathVariable String email, @RequestBody String phoneNumber) {
        System.out.println("AccountController_changePhoneNumber().");

        accountService.changePhoneNumber(phoneNumber, email);
        System.out.println("AccountController_changePhoneNumber()_Successful phone number change.");
        return ResponseEntity.ok(phoneNumber);
    }

    @PutMapping("profile/changeAddress/{userId}")
    ResponseEntity<AddressDTO> changeAddress(@PathVariable Long userId, @RequestBody Address address) {
        System.out.println("changeAddress().");

        accountService.changeAddress(userId, address);
        System.out.println("AccountController_changeAddress()_Successful address change.");

        return ResponseEntity.ok(addressDTOMapping(address));
    }

    private AddressDTO addressDTOMapping(Address userAddress) {
        AddressDTO dto = new AddressDTO(
                userAddress.getId(),
                userAddress.getLabel(),
                userAddress.getStreetName(),
                userAddress.getPostalCode() == null ? null : Integer.valueOf(userAddress.getPostalCode()),
                userAddress.getCity(),
                userAddress.getCountry());
        return dto;
    }

    @DeleteMapping("address/deleteAddress/{addressId}")
    private void deleteAddress(@PathVariable Long addressId) {
        System.out.println("AccountController_deleteAddress().");

        accountService.deleteAddress(addressId);
    }
}
