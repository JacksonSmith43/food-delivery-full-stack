import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

import { RestaurantsService } from '../../../shared/services/restaurants.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../auth/service/auth.service';
import { FavouritesService } from '../../../shared/services/favourites.service';
import { AccountService } from '../../../account/service/account.service';
import { MenuItemsType } from '../../../shared/model/restaurants-type.module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [MatIcon, MatChipsModule, UpperCasePipe, TitleCasePipe],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css',
})
export class RestaurantDetailComponent implements OnInit {
  private readonly imageBaseUrl = `${environment.apiBaseUrl}/images`;

  restaurantService = inject(RestaurantsService);
  localStorageService = inject(LocalStorageService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  favouritesService = inject(FavouritesService);
  accountService = inject(AccountService);

  router = inject(Router);

  allRestaurants = this.restaurantService.allRestaurants;
  filteredRestaurants = this.restaurantService.filteredRestaurants;
  category = this.restaurantService.categories;
  cartSummary = this.cartService.cartSummary;
  menuItemIds = this.favouritesService.menuItemIds;
  menuItems = this.restaurantService.menuItems;
  filteredMenuItems = this.restaurantService.filteredMenuItems;
  filteredDietaryLabelByMenuItem = this.restaurantService.filteredDietaryLabelByMenuItem;

  menuItemsIdsComputed = computed(() => this.menuItemIds());

  ngOnInit(): void {
    console.log('RestaurantDetailComponent_ngOnInit().');

    if (!this.accountService.currentUserProfile()) {
      this.accountService.getCurrentUserProfile().subscribe({
        next: (user) => {
          console.log('RestaurantDetailComponent_ngOnInit()_user: ', user);
          this.accountService.currentUserProfile.set(user);
          this.getFavouriteMenuItemIds();
        },
        error: (error) => {
          console.error('RestaurantDetailComponent_ngOnInit()_Error loading profile: ', error.error.message);
        },
      });
    }

    let menuItems = this.localStorageService.getMenuItems('menuItemsofChosenRestaurant');
    let restaurant = this.localStorageService.getCurrentRestaurant('chosenRestaurant');

    console.log('RestaurantDetailComponent_ngOnInit()_menuItems: ', menuItems);
    console.log('RestaurantDetailComponent_ngOnInit()_restaurant: ', restaurant);

    this.menuItems.set(menuItems);
    this.filteredMenuItems.set(menuItems);
    this.allRestaurants.set(restaurant);

    this.cartService.refreshCart();
    this.restaurantService.countDietaryLabelsForMenuItems();
  }

  getCurrentRestaurant(): string[] {
    return this.allRestaurants().map((r) => r.restaurantName);
  }

  getCurrentRestaurantImage(): string[] {
    return this.allRestaurants().map((r) => r.imageName);
  }

  getCurrentRestaurantImageUrl(): string {
    const imageName = this.allRestaurants()[0]?.imageName;
    return imageName ? `${this.imageBaseUrl}/restaurants/${imageName}` : '';
  }

  getMenuImageUrl(fileName: string): string {
    return `${this.imageBaseUrl}/menus/${fileName}`;
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

    if (!this.authService.authUser()) {
      console.log('RestaurantDetailComponent_onAddToCart()_this.router.url :', this.router.url);

      // Redirects to the login page. The URL would look like this: http://localhost:4200/login?returnUrl=%2Frestaurant%2FLast%2520Resort%2520Diner
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

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

    if (!this.authService.authUser()) {
      console.log('RestaurantDetailComponent_onRemoveFromCart()_this.router.url :', this.router.url);

      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

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

    if (!this.authService.authUser()) {
      console.log('RestaurantDetailComponent_onAddToFavourite()_this.router.url :', this.router.url);

      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

    console.log(
      'RestaurantDetailComponent_onAddToFavourite()_this.authService.authUser() :',
      this.authService.authUser(),
    );

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

    if (!this.authService.authUser()) {
      console.log('RestaurantDetailComponent_onRemoveFromFavourites()_this.router.url :', this.router.url);

      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

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

  onFilterDietaryChange(event: MatChipListboxChange): MenuItemsType[] {
    console.log('RestaurantDetailComponent_onFilterDietaryChange().');
    console.log('RestaurantDetailComponent_onFilterDietaryChange()_value: ', event.value);

    let value: string = event.value;

    // When all chips have been deselected, the value will be undefined. Then all menuItems should be visible again.
    if (value === undefined) {
      this.filteredMenuItems.set([...this.menuItems()]);
      return this.filteredMenuItems();
    }

    return this.restaurantService.filterDietaryLabelByMenuItem(value);
  }
}
