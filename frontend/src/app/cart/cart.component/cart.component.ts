import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';

import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../auth/service/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AccountService } from '../../account/service/account.service';

@Component({
  selector: 'app-cart',
  imports: [MatIcon, MatAnchor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  locaStorageService = inject(LocalStorageService);
  accountService = inject(AccountService);

  isSuccessful = this.cartService.isSuccessful;
  errorMessage = this.cartService.errorMessage;
  successMessage = this.cartService.successMessage;

  cart = this.cartService.cart;
  cartSummary = this.cartService.cartSummary;

  cartLength = computed(() => this.cart()?.cartItems?.length || 0);

  ngOnInit(): void {
    console.log('CartComponent_ngOnInit().');
    this.cartService.refreshCart();

    this.accountService.getCurrentUserProfile().subscribe({
      next: (user) => {
        console.log('CartComponent_ngOnInit()_next_user: ', user);
        this.accountService.currentUserProfile.set(user);
      },
      error: (error) => {
        console.error('CartComponent_ngOnInit()_Error: ', error.message);
      },
    });
    console.log('CartComponent_ngOnInit()_End.');
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
      error: (error) => console.error('CartComponent_onAddToCart()_Error adding item to cart:', error),
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
      error: (error) => console.error('CartComponent_onRemoveFromCart()_Error removing item from cart:', error),
    });
  }

  onCheckout() {
    console.log('onCheckout().');

    this.cartService.checkoutCart().subscribe({
      next: (userData) => {
        console.log('onCheckout()_userData: ', userData);
        this.successMessage.set('Checkout successful.');
        this.isSuccessful.set(true);

        setTimeout(() => {
          this.successMessage.set('');
          this.isSuccessful.set(false);
          // Empties the cart and cart summary after successful checkout.
          this.cart.set({ id: 0, sessionId: '', cartItems: [] });
          this.cartSummary.set({ totalQuantity: 0, totalCost: 0, itemCount: 0 });
        }, 2000);
      },
      error: (e) => {
        console.error('onCheckout()_Error: ', e);
        this.errorMessage.set(JSON.parse(e.error).message || 'Checkout failed. Please try again.');
        this.isSuccessful.set(false);
      },
    });
  }
}
