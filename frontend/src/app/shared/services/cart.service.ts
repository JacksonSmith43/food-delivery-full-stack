import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { CartType, CartSummaryType } from '../model/cart-type';
import { CheckoutType } from '../model/checkout-type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

  cart = signal<CartType | null>(null);
  cartSummary = signal<CartSummaryType>({ totalQuantity: 0, totalCost: 0, itemCount: 0 });
  checkoutCartSignal = signal<CheckoutType>({
    id: 0,
    address: { id: 0, streetName: '', postCode: 0, country: '' },
    phoneNumber: 0,
    cartSummary: { totalQuantity: 0, totalCost: 0, itemCount: 0 },
  });

  getCart(): Observable<CartType> {
    console.log('getCart().');
    return this.http.get<CartType>('/api/cart');
  }

  addItemToCart(menuItemId: number, quantity: number): Observable<CartType> {
    console.log('addItemToCart().');
    return this.http.post<CartType>('/api/cart/add', { menuItemId, quantity });
  }

  // Decrease quantity.
  removeItemFromCart(menuItemId: number, quantity: number): Observable<CartType> {
    console.log('removeItemFromCart().');
    return this.http.post<CartType>('/api/cart/remove', { menuItemId, quantity });
  }

  getCartSummary(): Observable<CartSummaryType> {
    console.log('CartService_getCartSummary().');
    return this.http.get<CartSummaryType>('/api/cart/summary');
  }

  refreshCart(): void {
    console.log('CartService_refreshCart().');

    this.getCart().subscribe({
      next: (cart) => this.cart.set(cart),
      error: (error) => console.error('CartService_refreshCart()_Error refreshing cart:', error),
    });

    this.getCartSummary().subscribe({
      next: (summary) => this.cartSummary.set(summary),
      error: (error) =>
        console.error('CartService_refreshCart()_Error refreshing cart summary:', error),
    });
  }

  getItemQuantity(menuItemId: number): number {
    console.log('CartService_getItemQuantity().');

    const currentCart = this.cart();
    console.log('CartService_getItemQuantity()_currentCart: ', currentCart);

    if (!currentCart) {
      return 0;
    }

    const cartItem = currentCart.cartItems.find((item) => item.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0; // If the id does not match the menuItemId, then return 0.
  }

  checkoutCart() {
    console.log('checkoutCart().');
    let checkoutCart = this.checkoutCartSignal();
    return this.http.post('/api/cart/checkout', checkoutCart);
  }
}
