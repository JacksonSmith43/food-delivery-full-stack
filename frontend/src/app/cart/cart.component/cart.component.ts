import { Component, inject, OnInit } from '@angular/core';

import { CartService } from '../../shared/services/cart.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart.component',
  imports: [MatIcon],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);

  cart = this.cartService.cart;
  cartSummary = this.cartService.cartSummary;

  ngOnInit(): void {
    console.log('CartComponent_ngOnInit().');
    this.cartService.refreshCart();
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
}
