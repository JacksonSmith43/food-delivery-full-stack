import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { CartType, CartSummaryType } from '../model/cart-type';
import { AccountService } from '../../account/service/account.service';
import { AuthService } from '../../auth/service/auth.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  accountService = inject(AccountService);
  authService = inject(AuthService);
  locaStorageService = inject(LocalStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  cart = signal<CartType | null>(null);
  cartSummary = signal<CartSummaryType>({ totalQuantity: 0, totalCost: 0, itemCount: 0 });

  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isSuccessful = signal<boolean>(false);

  checkoutCartComputed = computed(() => ({
    id: 0,
    // email: this.authService.authUser()?.email,
    address: {
      id: this.accountService.currentUserProfile()?.address[0]?.id,
      label: this.accountService.currentUserProfile()?.address[0]?.label,
      streetName: this.accountService.currentUserProfile()?.address[0]?.streetName,
      postalCode: this.accountService.currentUserProfile()?.address[0]?.postalCode,
      city: this.accountService.currentUserProfile()?.address[0]?.city,
      country: this.accountService.currentUserProfile()?.address[0]?.country,
    },
    phoneNumber: this.accountService.currentUserProfile()?.phoneNumber,
    // defaultAddressId: this.accountService.currentUserProfile()?.defaultAddressId,
    cartSummary: {
      totalQuantity: this.cartSummary().totalQuantity,
      totalCost: this.cartSummary().totalCost,
      itemCount: this.cartSummary().itemCount,
    },
  }));

  getCart(): Observable<CartType> {
    console.log('getCart().');
    return this.http.get<CartType>(`${this.apiBaseUrl}/api/cart`);
  }

  addItemToCart(menuItemId: number, quantity: number): Observable<CartType> {
    console.log('addItemToCart().');
    return this.http.post<CartType>(`${this.apiBaseUrl}/api/cart/add`, { menuItemId, quantity });
  }

  // Decrease quantity.
  removeItemFromCart(menuItemId: number, quantity: number): Observable<CartType> {
    console.log('removeItemFromCart().');
    return this.http.post<CartType>(`${this.apiBaseUrl}/api/cart/remove`, { menuItemId, quantity });
  }

  getCartSummary(): Observable<CartSummaryType> {
    console.log('CartService_getCartSummary().');
    return this.http.get<CartSummaryType>(`${this.apiBaseUrl}/api/cart/summary`);
  }

  refreshCart(): void {
    console.log('CartService_refreshCart().');

    this.getCart().subscribe({
      next: (cart) => this.cart.set(cart),
      error: (error) => console.error('CartService_refreshCart()_Error refreshing cart:', error),
    });

    this.getCartSummary().subscribe({
      next: (summary) => this.cartSummary.set(summary),
      error: (error) => console.error('CartService_refreshCart()_Error refreshing cart summary:', error),
    });
  }

  getItemQuantity(menuItemId: number): number {
    // console.log('CartService_getItemQuantity().');

    const currentCart = this.cart();
    // console.log('CartService_getItemQuantity()_currentCart: ', currentCart);

    if (!currentCart) {
      return 0;
    }

    const cartItem = currentCart.cartItems.find((item) => item.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0; // If the id does not match the menuItemId, then return 0.
  }

  checkoutCart(): Observable<string> {
    console.log('checkoutCart().');
    let checkoutCart = this.checkoutCartComputed();

    console.log('checkoutCart()_checkoutCart: ', checkoutCart);
    return this.http.post(`${this.apiBaseUrl}/api/cart/checkout`, checkoutCart, { responseType: 'text' });
  }
}
