package com.fooddelivery.dto;

public class AddressDTO {
    Long id;
    String label;
    String streetName;
    Integer postalCode;
    String city;
    String country;

    public AddressDTO() {

    }

    public AddressDTO(Long id, String label, String streetName, Integer postalCode, String city, String country) {
        this.id = id;
        this.label = label;
        this.streetName = streetName;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(Integer postalCode) {
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
        return "AddressDTO [id=" + id + ", label=" + label + ", streetName=" + streetName + ", postalCode=" + postalCode
                + ", city=" + city + ", country=" + country + "]";
    }
}
