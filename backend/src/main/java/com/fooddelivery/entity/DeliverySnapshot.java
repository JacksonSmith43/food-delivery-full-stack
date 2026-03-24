package com.fooddelivery.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class DeliverySnapshot {
    private String name;
    private Long userId;
    private String phoneNumber;

    private String label;
    private String streetName;
    private String postalCode;
    private String city;
    private String country;

    public DeliverySnapshot() {

    }

    public DeliverySnapshot(String name, Long userId, String phoneNumber, String label, String streetName,
            String postalCode, String city, String country) {
        this.name = name;
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.label = label;
        this.streetName = streetName;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return "DeliverySnapshot [name=" + name + ", userId=" + userId + ", phoneNumber=" + phoneNumber + ", label="
                + label + ", streetName=" + streetName + ", postalCode=" + postalCode + ", city=" + city + ", country="
                + country + "]";
    }

}
