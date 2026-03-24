package com.fooddelivery.dto;

public class CheckoutCartDTO {
    Long id;
    AddressDTO address; // TODO: Determine which one is isDefault.
    String phoneNumber;
    CartSummaryDTO cartSummary;

    public CheckoutCartDTO() {

    }

    public CheckoutCartDTO(Long id, AddressDTO address, String phoneNumber, CartSummaryDTO cartSummary) {
        this.id = id;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.cartSummary = cartSummary;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public CartSummaryDTO getCartSummary() {
        return cartSummary;
    }

    public void setCartSummary(CartSummaryDTO cartSummary) {
        this.cartSummary = cartSummary;
    }

    @Override
    public String toString() {
        return "CheckoutCartDTO [id=" + id + ", address=" + address + ", phoneNumber=" + phoneNumber + ", cartSummary="
                + cartSummary + "]";
    }
}
