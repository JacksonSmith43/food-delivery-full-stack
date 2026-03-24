package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.CartSummaryDTO;
import com.fooddelivery.dto.CheckoutCartDTO;
import com.fooddelivery.service.OrderService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // HttpSession comes from the server.
    @PostMapping("/checkout/{email}")
    public ResponseEntity<String> checkoutCart(@PathVariable String email,
            @RequestBody CheckoutCartDTO checkoutCart,
            HttpSession session) {

        System.out.println("CartController_checkoutCart().");

        Long userId = orderService.getIdByEmail(email);
        String phoneNumber = checkoutCart.getPhoneNumber();
        AddressDTO addresses = checkoutCart.getAddress();
        CartSummaryDTO cartSummary = checkoutCart.getCartSummary();
        String sessionId = session.getId();

        System.out.println("OrderController()_phoneNumber: " + phoneNumber);
        System.out.println("OrderController()_userId: " + userId);

        if (addresses.getLabel() == null || addresses.getStreetName() == null || addresses.getPostalCode() == null
                || addresses.getCity() == null || addresses.getCountry() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Address is null.");
        }

        if (cartSummary.getTotalQuantity() == null || cartSummary.getTotalCost() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("cartSummary is null.");
        }

        System.out.println("OrderController()_checkoutCart: " + checkoutCart);
        Integer totalQuantity = cartSummary.getTotalQuantity();
        System.out.println("OrderController_checkoutCart()_totalQuantity: " + totalQuantity);

        orderService.createOrder(checkoutCart, userId);
        orderService.emptyCart(sessionId);

        return ResponseEntity.ok().build();
    }
}
