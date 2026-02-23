import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';

import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../auth/service/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-cart',
  imports: [MatIcon, MatAnchor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  locaStorage = inject(LocalStorageService);

  cart = this.cartService.cart;
  cartSummary = this.cartService.cartSummary;
  cartLength = computed(() => this.cart()?.cartItems?.length || 0);

  ngOnInit(): void {
    console.log('CartComponent_ngOnInit().');
    this.cartService.refreshCart();

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);
    }
  }

  getCart() {
    console.log('CartComponent_getCart().');
    this.cartService.getCart().subscribe({
      next: (item) => {
        this.cart.set({ id: item.id, sessionId: item.sessionId, cartItems: item.cartItems });
        return item.cartItems;
      },
    });
  }

  onAddToCart(menuItemId: number) {
    console.log('CartComponent_onAddToCart().');
    console.log('CartComponent_onAddToCart()_menuItemId:', menuItemId);

    this.cartService.addItemToCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('CartComponent_onAddToCart()_Item added to cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) =>
        console.error('CartComponent_onAddToCart()_Error adding item to cart:', error),
    });
  }

  onRemoveFromCart(menuItemId: number) {
    console.log('CartComponent_onRemoveFromCart().');
    console.log('CartComponent_onRemoveFromCart()_menuItemId:', menuItemId);

    this.cartService.removeItemFromCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('CartComponent_onRemoveFromCart()_Item removed from cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) =>
        console.error('CartComponent_onRemoveFromCart()_Error removing item from cart:', error),
    });
  }

  onCheckout() {
    console.log('onCheckout().');

    this.cartService.checkoutCart().subscribe({
      next: (userData) => {
        console.log('onCheckout()_userData: ', userData);
      },
      error: (e) => {
        console.error('onCheckout()_Error: ', e);
      },
    });
  }
}
