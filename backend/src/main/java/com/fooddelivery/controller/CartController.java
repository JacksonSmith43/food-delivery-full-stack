package com.fooddelivery.controller;

import com.fooddelivery.entity.Cart;
import com.fooddelivery.service.CartService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(HttpSession session) {
        String sessionId = session.getId();
        Cart cart = cartService.getCart(sessionId);
        return ResponseEntity.ok(cart);
    }

    // Body: { "menuItemId": 1, "quantity": 1 }
    @PostMapping("/add")
    public ResponseEntity<Cart> addItemToCart(
            @RequestBody Map<String, Object> request,
            HttpSession session) {
        String sessionId = session.getId();
        Long menuItemId = Long.valueOf(request.get("menuItemId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        Cart cart = cartService.addItemToCart(sessionId, menuItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/remove")
    public ResponseEntity<Cart> removeItemFromCart(
            @RequestBody Map<String, Object> request,
            HttpSession session) {
        String sessionId = session.getId();
        Long menuItemId = Long.valueOf(request.get("menuItemId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        Cart cart = cartService.removeItemFromCart(sessionId, menuItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getCartSummary(
            HttpSession session) {
        String sessionId = session.getId();
        Cart cart = cartService.getCart(sessionId);

        Map<String, Object> summary = Map.of(
                "totalQuantity", cart.getTotalQuantity(),
                "totalCost", cart.getTotalCost(),
                "itemCount", cart.getCartItems().size());

        return ResponseEntity.ok(summary);
    }
}
