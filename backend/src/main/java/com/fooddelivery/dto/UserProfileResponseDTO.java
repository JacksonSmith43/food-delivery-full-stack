package com.fooddelivery.dto;

import java.util.List;

public class UserProfileResponseDTO {

    private String email;

    private String phoneNumber;

    private List<AddressDTO> address;

    public UserProfileResponseDTO() {

    }

    public UserProfileResponseDTO(String email, String phoneNumber, List<AddressDTO> address) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<AddressDTO> getAddress() {
        return address;
    }

    public void setAddress(List<AddressDTO> address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "UserProfileResponseDTO [email=" + email + ", phoneNumber=" + phoneNumber + ", address="
                + address + "]";
    }

}
