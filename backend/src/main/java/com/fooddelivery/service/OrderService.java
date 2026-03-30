package com.fooddelivery.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.dto.AddressDTO;
import com.fooddelivery.dto.CheckoutCartDTO;
import com.fooddelivery.dto.OrderDTO;
import com.fooddelivery.dto.OrderItemDTO;
import com.fooddelivery.entity.Cart;
import com.fooddelivery.entity.CartItem;
import com.fooddelivery.entity.DeliverySnapshot;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderItem;
import com.fooddelivery.entity.User;
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

    public void createOrder(CheckoutCartDTO checkoutCartDto, Long userId, String sessionId) {
        System.out.println("OrderService_createOrder().");

        Order order = new Order();
        AddressDTO address = checkoutCartDto.getAddress();
        Cart cart = cartRepository.findBySessionId(sessionId).orElse(null);

        if (cart == null) {
            throw new RuntimeException("OrderService_createOrder()_Cart not found for sessionId: " + sessionId);
        }

        List<CartItem> cartItems = cart.getCartItems();

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("OrderService_createOrder()_Cannot checkout an empty cart.");
        }

        // Order [id=null, totalAmount=null, totalCost=null, status=null,
        // createdAt=null, currency=null, paymentMethod=null, paymentStatus=null,
        // deliverySnapshot=null
        System.out.println("OrderService_createOrder()_order: " + order);
        // Cart [id=2, sessionId=DEBCD94362F87A14CD5B0DAB38C7A9CE, totalItems=2]
        System.out.println("OrderService_createOrder()_cart: " + cart);
        // [CartItem [id=5, menuItem=Phad Thai (Nationalgericht), quantity=1]]
        System.out.println("OrderService_createOrder()_cartItems: " + cartItems);

        DeliverySnapshot snapshot = new DeliverySnapshot(
                null,
                userId,
                checkoutCartDto.getPhoneNumber(),
                address.getLabel(),
                address.getStreetName(),
                String.valueOf(address.getPostalCode()),
                address.getCity(),
                address.getCountry());
        // DeliverySnapshot [name=null, userId=1, phoneNumber=2222, label=Home,
        // streetName=Tardisgasse, postalCode=20, city=Vienna, country=Austria]
        System.out.println("OrderService_createOrder()_snapshot: " + snapshot);

        order.setDeliverySnapshot(snapshot);
        order.setTotalAmount(checkoutCartDto.getCartSummary().getTotalQuantity());
        order.setTotalCost(checkoutCartDto.getCartSummary().getTotalCost());
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItemId(cartItem.getMenuItem().getId());
            orderItem.setPrice(cartItem.getMenuItem().getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            orderItem.setMenuItemNameSnapshot(cartItem.getMenuItem().getFoodName());
            return orderItem;
        }).toList();

        // [OrderItem [id=null, quantity=1, price=12.80, menuItemId=22, order=Order
        // [id=null, totalAmount=1, totalCost=12.8, status=null,
        // createdAt=2026-03-30T10:37:08.939855300, currency=null, paymentMethod=null,
        // paymentStatus=null, deliverySnapshot=DeliverySnapshot [name=null, userId=1,
        // phoneNumber=2222, label=Home, streetName=Tardisgasse, postalCode=20,
        // city=Vienna, country=Austria], menuItemNameSnapshot=Phad Thai
        // (Nationalgericht)]]
        System.out.println("OrderService_createOrder()_orderItems: " + orderItems);

        order.setOrderItems(orderItems);
        orderRepository.save(order);
    }

    public Long getIdByEmail(String email) {
        if (email == null) {
            throw new EmailDoesNotExistException("Email is null.");
        }

        User user = userRepository.getByEmail(email);
        if (user == null) {
            throw new EmailDoesNotExistException("User does not exist for email: " + email);
        }

        Long id = user.getId();
        return id;
    }

    // Transactional: This ensures that the entire method runs within a single
    // transaction, which is important for data integrity when modifying the cart.
    // Simply this annotation will ensure that if any part of the method fails (like
    // if the cart is not found), the entire transaction will be rolled back,
    // preventing partial updates to the database. If it successfully completes, the
    // transaction will be committed, ensuring that the cart is properly cleared.
    @Transactional
    public void emptyCart(String sessionId, Long userId) {
        System.out.println("OrderService_emptyCart().");

        Cart cart = cartRepository.findBySessionId(sessionId).orElse(null);
        // Cart [id=1, sessionId=27FBA8B6AC67A3AEC0BCF839F97980F8, totalItems=1]
        System.out.println("OrderService_emptyCart()_cart: " + cart);

        if (cart == null) {
            throw new RuntimeException("OrderService_emptyCart()_Cart not found for sessionId: " + sessionId);
        }

        cart.getCartItems().clear();
        cartRepository.save(cart);
        System.out.println("OrderService_emptyCart()_Cart has been cleared.");
    }

    public List<OrderDTO> getOrders(String email) {
        System.out.println("OrderService_getOrders().");

        if (email == null) {
            throw new EmailDoesNotExistException("Email is null.");
        }

        User user = userRepository.getByEmail(email);
        if (user == null) {
            throw new EmailDoesNotExistException("User does not exist for email: " + email);
        }

        Long userId = user.getId();
        List<Order> orders = orderRepository.findByDeliverySnapshotUserIdOrderByCreatedAtDesc(userId);
        if (orders.isEmpty()) {
            throw new RuntimeException("No orders found for userId: " + userId);
        }

        List<OrderDTO> orderDtos = orders.stream().map(order -> {
            DeliverySnapshot deliverySnapshot = order.getDeliverySnapshot();
            List<OrderItemDTO> orderItemDtos = order.getOrderItems().stream().map(orderItem -> new OrderItemDTO(
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getMenuItemNameSnapshot())).toList();

            return new OrderDTO(
                order.getTotalAmount(),
                order.getTotalCost(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getCurrency(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                new DeliverySnapshot(
                    deliverySnapshot.getName(),
                    deliverySnapshot.getUserId(),
                    deliverySnapshot.getPhoneNumber(),
                    deliverySnapshot.getLabel(),
                    deliverySnapshot.getStreetName(),
                    deliverySnapshot.getPostalCode(),
                    deliverySnapshot.getCity(),
                    deliverySnapshot.getCountry()),
                orderItemDtos);
        }).toList();

        System.out.println("OrderService_getOrders()_ordersCount: " + orderDtos.size());
        return orderDtos;
    }
}
