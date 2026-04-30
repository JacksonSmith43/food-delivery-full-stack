import { Component, computed, inject, OnInit } from '@angular/core';
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
  allRestaurants = this.restaurantService.allRestaurants;
  category = this.restaurantService.categories;
  cartSummary = this.cartService.cartSummary;
  menuItemIds = this.favouritesService.menuItemIds;

  menuItemsIdsComputed = computed(() => this.menuItemIds());

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
        this.getFavouriteMenuItemIds();
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
    this.allRestaurants.set(restaurant);

    this.cartService.refreshCart();
  }

  getCurrentRestaurant(): string[] {
    return this.allRestaurants().map((r) => r.restaurantName);
  }

  getCurrentRestaurantImage(): string[] {
    return this.allRestaurants().map((r) => r.imageName);
  }

  getCurrentCategory() {
    console.log('getCurrentCategory().');
    let category = this.allRestaurants()
      .flatMap((c) => c.categories)
      .map((c) => c.categorie)
      .join(', '); // It combines multiple categories into a single string separated by commas.

    console.log('getCurrentCategory()_category: ', category);
    console.log('getCurrentCategory()_category_typeof: ', typeof category);

    return category;
  }

  onAddToCart(menuItemId: number) {
    console.log('RestaurantDetailComponent_onAddToCart().');
    console.log('RestaurantDetailComponent_onAddToCart()_menuItemId:', menuItemId);

    this.cartService.addItemToCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('RestaurantDetailComponent_onAddToCart()_Item added to cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) => console.error('RestaurantDetailComponent_onAddToCart()_Error adding item to cart:', error),
    });
  }

  onRemoveFromCart(menuItemId: number) {
    console.log('RestaurantDetailComponent_onRemoveFromCart().');
    console.log('RestaurantDetailComponent_onRemoveFromCart()_menuItemId:', menuItemId);

    this.cartService.removeItemFromCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('RestaurantDetailComponent_onRemoveFromCart()_Item removed from cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) =>
        console.error('RestaurantDetailComponent_onRemoveFromCart()_Error removing item from cart:', error),
    });
  }

  getItemQuantity(menuItemId: number): number {
    console.log('getItemQuantity().');
    return this.cartService.getItemQuantity(menuItemId);
  }

  onAddToFavourite(menuId: number) {
    console.log('onAddToFavourite().');

    let currentId: number = this.accountService.currentUserProfile()!.id;

    this.menuItemIds.update((ids) => [...ids, menuId]);

    this.favouritesService.addToFavourite(currentId, menuId).subscribe({
      next: (favourites) => {
        console.log('onAddToFavourite()_favourites: ', favourites);
        console.log('onAddToFavourite()_this.menuItemIds(): ', this.menuItemIds());
      },
      error: (e) => {
        console.error('onAddToFavourite()_Error: ', e);
        this.favouritesService.menuItemIdErrorMessages.update((errors) => ({
          ...errors, // Keeps the current entries.
          [menuId]: e.error.code, // Adds new values.
        }));
      },
    });
  }

  onRemoveFromFavourites(menuId: number) {
    console.log('onRemoveFromFavourites().');

    let currentId: number = this.accountService.currentUserProfile()!.id;

    this.menuItemIds.update((ids) => [...ids, menuId]);

    this.favouritesService.removeFromFavourite(currentId, menuId).subscribe({
      next: (favourites) => {
        console.log('onRemoveFromFavourites()_favourites: ', favourites);
        this.menuItemIds.update((fav) => fav.filter((rem) => rem !== menuId));
        console.log('onRemoveFromFavourites()_this.menuItemIds(): ', this.menuItemIds());
      },
      error: (e) => {
        console.error('onRemoveFromFavourites()_Error: ', e);
        this.favouritesService.menuItemIdErrorMessages.update((errors) => ({
          ...errors,
          [menuId]: e.error.code,
        }));
      },
    });
  }

  getFavouriteMenuItemIds(): number[] {
    console.log('RestaurantDetailComponent_getFavouriteMenuItemIds().');

    let userId = this.accountService.currentUserProfile()?.id;
    console.log('RestaurantDetailComponent_getFavouriteMenuItemIds()_userId: ', userId);

    this.favouritesService.getFavouriteMenuItemIds(userId!).subscribe({
      next: (favourites) => {
        console.log('RestaurantDetailComponent_getFavouriteMenuItemIds()_favourites:', favourites);
        this.menuItemIds.update(() => favourites as number[]);

        return favourites as number[];
      },
      error: (e) => {
        console.error('RestaurantDetailComponent_getFavouriteMenuItemIds()_Error: ', e.error);
        return [];
      },
    });
    return [];
  }
}
