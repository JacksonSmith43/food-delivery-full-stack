package com.fooddelivery.controller;

import java.util.List;

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

import jakarta.servlet.http.HttpSession;

@Controller
@RestController
@RequestMapping("/api/user/account/")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {
    private static final String AUTH_USER_EMAIL = "authUserEmail";
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("profile/me")
    ResponseEntity<UserProfileResponseDTO> getProfile(HttpSession session) {
        System.out.println("AccountController_getProfile().");

        String email = (String) session.getAttribute(AUTH_USER_EMAIL);
        System.out.println("AccountController_getProfile()_userProfile_email: " + email);
        return ResponseEntity.ok(accountService.getUserProfile(email));
    }

    @PostMapping("profile/addAddress")
    ResponseEntity<AddressDTO> addAddress(@RequestBody Address address, HttpSession session) {
        System.out.println("AccountController_addAddress().");

        String email = (String) session.getAttribute(AUTH_USER_EMAIL);

        Address userAddress = accountService.addAddress(address, email);

        AddressDTO dto = addressDTOMapping(userAddress);

        System.out.println("AccountController_addAddress()_Successful address addition.");
        return ResponseEntity.ok(dto);
    }

    @PostMapping("profile/changePhoneNumber")
    ResponseEntity<String> changePhoneNumber(@RequestBody String phoneNumber, HttpSession session) {
        System.out.println("AccountController_changePhoneNumber().");

        String email = (String) session.getAttribute(AUTH_USER_EMAIL);

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
    private ResponseEntity<List<Address>> deleteAddress(@PathVariable Long addressId) {
        System.out.println("AccountController_deleteAddress().");

        List<Address> allAddresses = accountService.deleteAddress(addressId);
        System.out.println("AccountController_deleteAddress()_allAddresses" + allAddresses);

        return ResponseEntity.ok().body(allAddresses);
    }
}
