package com.fooddelivery.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.UserProfileResponseDTO;
import com.fooddelivery.entity.Address;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.AddressRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class AccountService {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    AccountService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public UserProfileResponseDTO getUserProfile(String email) {
        System.out.println("AccountService_getUserProfile().");

        User user = userRepository.getByEmail(email);

        if (user == null) {
            System.out.println("AccountService_getUserProfile(): User not found for email: " + email);
            return null;
        }

        List<AddressDTO> addresses = user.getAddress() == null
                ? List.of()
                // stream() starts the process of converting the list of Address entities to a
                // list of AddressDTOs.
                : user.getAddress().stream()
                        // map() converts each Address entity to an AddressDTO using the mapAddressToDTO
                        // method.
                        .map(this::mapAddressToDTO)
                        // toList() collects the results of the mapping into a new List<AddressDTO>.
                        .toList();

        System.out.println("AccountService_getUserProfile()_addresses" + addresses);

        return new UserProfileResponseDTO(
                user.getEmail(),
                user.getPhoneNumber(),
                addresses);
    }

    private AddressDTO mapAddressToDTO(Address address) {
        System.out.println("AccountService_mapAddressToDTO().");

        return new AddressDTO(
                address.getId(),
                address.getLabel(),
                address.getStreetName(),
                parsePostalCode(address.getPostalCode()),
                address.getCity(),
                address.getCountry());
    }

    private Integer parsePostalCode(String postalCode) {
        System.out.println("AccountService_parsePostalCode().");
        System.out.println("AccountService_parsePostalCode()_postalCode: " + postalCode);

        if (postalCode == null || postalCode.isBlank()) {
            return null;
        }
        try {
            return Integer.valueOf(postalCode);
        } catch (NumberFormatException ignored) {
            System.out.println("AccountService_parsePostalCode(): Invalid postal code format: " + postalCode);
            return null;
        }
    }

    public Address addAddress(Address address, String email) {
        System.out.println("AccountService_addAddress().");

        User user = userRepository.getByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("AccountService_addAddress()_User not found.");
        }

        address.setUser(user);
        return addressRepository.save(address);
    }

    public Boolean changePhoneNumber(String phoneNumber, String email) {
        System.out.println("changePhoneNumber().");

        try {

            User user = userRepository.getByEmail(email);

            if (user == null) {
                throw new IllegalArgumentException("AccountService_changePhoneNumber()_User not found.");
            }

            String phoneNumberExists = user.getPhoneNumber();

            if (!phoneNumberExists.isEmpty()) {
                if (phoneNumberExists.equals(phoneNumber)) {
                    System.out.println("changePhoneNumber()_The same phone number already exists.");
                    return false;
                }
            }

            user.setPhoneNumber(phoneNumber);
            userRepository.save(user);
            return true;

        } catch (Exception e) {
            System.out.println("AccountService_changePhoneNumber()_An error occurred: " + e.getMessage());
            throw new RuntimeException("AccountService_changePhoneNumber()_An error occurred: " + e.getMessage());
        }
    }
}
