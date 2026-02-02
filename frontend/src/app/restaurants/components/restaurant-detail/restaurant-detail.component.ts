import { Component, inject, OnInit } from '@angular/core';

import { RestaurantsService } from '../../../shared/services/restaurants.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { CartService } from '../../../shared/services/cart.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css',
})
export class RestaurantDetailComponent implements OnInit {
  restaurantService = inject(RestaurantsService);
  localStorageService = inject(LocalStorageService);
  cartService = inject(CartService);

  menuItems = this.restaurantService.menuItems;
  restaurant = this.restaurantService.restaurants;
  category = this.restaurantService.categories;
  cartSummary = this.cartService.cartSummary;

  ngOnInit(): void {
    console.log('RestaurantDetailComponent_ngOnInit().');

    let menuItems = this.localStorageService.getMenuItems('menuItemsofChosenRestaurant');
    let restaurant = this.localStorageService.getCurrentRestaurant('chosenRestaurant');

    console.log('RestaurantDetailComponent_ngOnInit()_menuItems: ', menuItems);
    console.log('RestaurantDetailComponent_ngOnInit()_restaurant: ', restaurant);

    this.menuItems.set(menuItems);
    this.restaurant.set(restaurant);

    this.cartService.refreshCart();
  }

  getCurrentRestaurant(): string[] {
    return this.restaurant().map((r) => r.restaurantName);
  }

  getCurrentRestaurantImage(): string[] {
    return this.restaurant().map((r) => r.imageName);
  }

  getCurrentCategory() {
    console.log('getCurrentCategory().');
    let category = this.restaurant()
      .flatMap((c) => c.categories)
      .map((c) => c.categorie)
      .join(', '); // It combines multiple categories into a single string separated by commas.

    console.log('getCurrentCategory()_category: ', category);
    console.log('getCurrentCategory()_category_typeof: ', typeof category);

    return category;
  }

  onAddToCart(menuItemId: number) {
    console.log('onAddToCart().');
    console.log('onAddToCart()_menuItemId:', menuItemId);

    this.cartService.addItemToCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('onAddToCart()_Item added to cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) => console.error('onAddToCart()_Error adding item to cart:', error),
    });
  }

  onRemoveFromCart(menuItemId: number) {
    console.log('onRemoveFromCart().');
    console.log('onRemoveFromCart()_menuItemId:', menuItemId);

    this.cartService.removeItemFromCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('onRemoveFromCart()_Item removed from cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) => console.error('onRemoveFromCart()_Error removing item from cart:', error),
    });
  }

  getItemQuantity(menuItemId: number): number {
    console.log('getItemQuantity().');
    return this.cartService.getItemQuantity(menuItemId);
  }
}
