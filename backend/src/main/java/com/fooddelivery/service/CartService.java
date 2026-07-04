package com.fooddelivery.service;

import com.fooddelivery.entity.Cart;
import com.fooddelivery.entity.CartItem;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.CartRepository;
import com.fooddelivery.repository.MenuItemRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
            MenuItemRepository menuItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public Cart getOrCreateCart(String sessionId) {
        System.out.println("getOrCreateCart().");

        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart(sessionId);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addItemToCart(String sessionId, Long menuItemId, Integer quantity) {
        System.out.println("addItemToCart().");

        Cart cart = getOrCreateCart(sessionId);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("addItemToCart()_MenuItem not found with id: " + menuItemId));

        // Check if item already exists in cart.
        CartItem existingCartItem = cartItemRepository
                .findByCartIdAndMenuItemId(cart.getId(), menuItemId)
                .orElse(null);

        if (existingCartItem != null) {
            // Updates quantity.
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartItemRepository.save(existingCartItem);
        } else {
            // Creates a new cart item.
            CartItem newCartItem = new CartItem(menuItem, quantity, cart);
            cart.addCartItem(newCartItem);
            cartItemRepository.save(newCartItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItemFromCart(String sessionId, Long menuItemId, Integer quantity) {
        System.out.println("removeItemFromCart().");

        Cart cart = getOrCreateCart(sessionId);

        CartItem cartItem = cartItemRepository
                .findByCartIdAndMenuItemId(cart.getId(), menuItemId)
                .orElseThrow(() -> new RuntimeException("removeItemFromCart()_CartItem not found."));

        int newQuantity = cartItem.getQuantity() - quantity;

        if (newQuantity <= 0) {
            // Remove item completely.
            cart.removeCartItem(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            // Decrease quantity.
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        }

        return cartRepository.save(cart);
    }

    // Get cart by session ID.
    public Cart getCart(String sessionId) {
        System.out.println("getCart().");
        return getOrCreateCart(sessionId);
    }

}
