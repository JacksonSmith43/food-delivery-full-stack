package com.fooddelivery.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true)
    private String sessionId;

    // mappedBy = "cart" means that CartItem has a field named "cart" (foreign key).
    // CascadeType.ALL means that all operations (delete, save, etc.) will be passed
    // along.
    // orphanRemoval = true means that if a CartItem is removed from the list, it
    // will also be deleted from the database.
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    // This prevents infinite recursion during JSON serialisation. Cart is the
    // parent and CartItem is the child.
    @JsonManagedReference
    private List<CartItem> cartItems = new ArrayList<>();

    public Cart() {
    }

    public Cart(String sessionId) {
        this.sessionId = sessionId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public void addCartItem(CartItem cartItem) {
        cartItems.add(cartItem);
        cartItem.setCart(this); // this: It refers to the current Object instance of Cart.
    }

    public void removeCartItem(CartItem cartItem) {
        cartItems.remove(cartItem);
        cartItem.setCart(null);
    }

    public Double getTotalCost() {
        return cartItems.stream()
                .mapToDouble(CartItem::getItemTotalPrice)
                .sum();
    }

    public Integer getTotalQuantity() {
        return cartItems.stream()
                // :: is the same as item => item.getQuantity().
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    @Override
    public String toString() {
        return "Cart [id=" + id + ", sessionId=" + sessionId + ", totalItems=" + cartItems.size() + "]";
    }
}
