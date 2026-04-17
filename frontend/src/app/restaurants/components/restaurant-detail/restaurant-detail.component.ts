import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { RestaurantsService } from '../../../shared/services/restaurants.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../auth/service/auth.service';
import { FavouritesService } from '../../../shared/services/favourites.service';
import { AccountService } from '../../../account/service/account.service';

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
  authService = inject(AuthService);
  favouritesService = inject(FavouritesService);
  accountService = inject(AccountService);

  menuItems = this.restaurantService.menuItems;
  restaurant = this.restaurantService.restaurants;
  category = this.restaurantService.categories;
  cartSummary = this.cartService.cartSummary;
  isFavourite = this.favouritesService.isFavourite;

  ngOnInit(): void {
    console.log('RestaurantDetailComponent_ngOnInit().');

    let userCredentials = this.localStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);
    }

    this.accountService.getUserProfile(userCredentials.email).subscribe({
      next: (user) => {
        console.log('RestaurantDetailComponent_ngOnInit()_user: ', user);
        this.accountService.currentUserProfile.set(JSON.parse(user));
      },
      error: (error) => {
        console.error('RestaurantDetailComponent_ngOnInit()_Error loading profile: ', error.error.message);
      },
    });

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
        this.isFavourite.set(false);
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
        this.isFavourite.set(false);
      },
      error: (error) => console.error('onRemoveFromCart()_Error removing item from cart:', error),
    });
  }

  getItemQuantity(menuItemId: number): number {
    console.log('getItemQuantity().');
    return this.cartService.getItemQuantity(menuItemId);
  }

  onAddToFavourite(menuId: number) {
    console.log('onAddToFavourite().');

    this.isFavourite.set(true);
    let currentId: number = this.accountService.currentUserProfile()!.id;

    this.favouritesService.menuItemIds.update((ids) => [...ids, menuId]);

    this.favouritesService.addToFavourite(currentId, menuId).subscribe({
      next: (favourites) => {
        console.log('onAddToFavourite()_favourites: ', favourites);
        console.log('onAddToFavourite()_this.favouritesService.menuItemIds(): ', this.favouritesService.menuItemIds());
      },
      error: (e) => {
        console.error('onAddToFavourite()_Error: ', e.message);
      },
    });
  }

  onRemoveFromFavourites(menuId: number) {
    console.log('onRemoveFromFavourites().');

    this.isFavourite.set(false);
    let currentId: number = this.accountService.currentUserProfile()!.id;

    this.favouritesService.menuItemIds.update((ids) => [...ids, menuId]);

    this.favouritesService.removeFromFavourite(currentId, menuId).subscribe({
      next: (favourites) => {
        console.log('onRemoveFromFavourites()_favourites: ', favourites);
        console.log(
          'onRemoveFromFavourites()_this.favouritesService.menuItemIds(): ',
          this.favouritesService.menuItemIds(),
        );
      },
      error: (e) => {
        console.error('onRemoveFromFavourites()_Error: ', e.message);
      },
    });
  }
}
