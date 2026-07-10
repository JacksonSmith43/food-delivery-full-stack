package com.fooddelivery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.CartSummaryDTO;
import com.fooddelivery.dto.CheckoutCartDTO;
import com.fooddelivery.dto.OrderDTO;
import com.fooddelivery.service.OrderService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private static final String AUTH_USER_EMAIL = "authUserEmail";

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // HttpSession comes from the server.
    @PostMapping("cart/checkout")
    public ResponseEntity<String> checkoutCart(@RequestBody CheckoutCartDTO checkoutCart,
            HttpSession session) {

        System.out.println("CartController_checkoutCart().");

        String email = (String) session.getAttribute(AUTH_USER_EMAIL);

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

        orderService.createOrder(checkoutCart, userId, sessionId);
        orderService.emptyCart(sessionId, userId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("orders")
    public ResponseEntity<List<OrderDTO>> getOrders(HttpSession session) {
        System.out.println("OrderController_getOrders().");

        String email = (String) session.getAttribute(AUTH_USER_EMAIL);

        List<OrderDTO> orders = orderService.getOrders(email);
        return ResponseEntity.ok(orders);
    }
}
