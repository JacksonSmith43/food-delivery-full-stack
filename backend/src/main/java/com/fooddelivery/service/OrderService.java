package com.fooddelivery.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.CheckoutCartDTO;
import com.fooddelivery.entity.Cart;
import com.fooddelivery.entity.DeliverySnapshot;
import com.fooddelivery.entity.Order;
import com.fooddelivery.exception.EmailDoesNotExistException;
import com.fooddelivery.repository.CartRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    public void createOrder(CheckoutCartDTO checkoutCartDto, Long userId) {
        System.out.println("OrderService_createOrder().");

        Order order = new Order();
        AddressDTO address = checkoutCartDto.getAddress();

        DeliverySnapshot snapshot = new DeliverySnapshot(
                null,
                userId,
                checkoutCartDto.getPhoneNumber(),
                address.getLabel(),
                address.getStreetName(),
                String.valueOf(address.getPostalCode()),
                address.getCity(),
                address.getCountry());

        order.setDeliverySnapshot(snapshot);
        order.setTotalAmount(checkoutCartDto.getCartSummary().getTotalQuantity());
        order.setTotalCost(checkoutCartDto.getCartSummary().getTotalCost());
        order.setCreatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }

    public Long getIdByEmail(String email) {
        if (email == null) {
            throw new EmailDoesNotExistException("Email is null.");
        }

        Long id = userRepository.getByEmail(email).getId();
        return id;
    }

    // Transactional: This ensures that the entire method runs within a single
    // transaction, which is important for data integrity when modifying the cart.
    // Simply this annotation will ensure that if any part of the method fails (like
    // if the cart is not found), the entire transaction will be rolled back,
    // preventing partial updates to the database. If it successfully completes, the
    // transaction will be committed, ensuring that the cart is properly cleared.
    @Transactional
    public void emptyCart(String sessionId) {
        System.out.println("OrderService_emptyCart().");

        Cart cart = cartRepository.findBySessionId(sessionId).orElse(null);

        if (cart == null) {
            throw new RuntimeException("OrderService_emptyCart()_Cart not found for sessionId: " + sessionId);
        }

        cart.getCartItems().clear();
        cartRepository.save(cart);
        System.out.println("OrderService_emptyCart()_Cart has been cleared.");
    }
}
