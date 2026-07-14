import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { FavouritesService } from '../../shared/services/favourites.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../auth/service/auth.service';
import { AccountService } from '../service/account.service';
import { FavouriteMenuItemsType } from '../../shared/model/favourite-menu-items-type';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favourites',
  imports: [MatIcon],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
})
export class FavouritesComponent implements OnInit {
  favouritesService = inject(FavouritesService);
  locaStorageService = inject(LocalStorageService);
  authService = inject(AuthService);
  accountService = inject(AccountService);
  cartService = inject(CartService);

  networkError = signal<string>('');
  errorMessage = signal<string>('');

  readonly imageBaseUrl = `${environment.apiBaseUrl}/images`;

  favouriteMenuItems = this.favouritesService.favouriteMenuItems;

  favouriteMenuItemsComputed = computed(() => this.favouriteMenuItems());

  ngOnInit(): void {
    console.log('FavouritesComponent_ngOnInit().');
    this.accountService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.accountService.currentUserProfile.set(user);
        this.getFavouriteMenuItems();
      },
      error: (error) => {
        console.error('FavouritesComponent_ngOnInit()_Error loading profile: ', error.error.message);
        if (error.status === 0) {
          this.networkError.set('Unable to load user profile. Please check your network connection and try again.');
        } else {
          this.errorMessage.set(error.statusText);
        }
      },
    });

    this.cartService.refreshCart();
  }

  getFavouriteMenuItems() {
    console.log('FavouritesComponent_getFavouriteMenuItems().');

    let userId = this.accountService.currentUserProfile()?.id;

    this.favouritesService.getFavouriteMenuItems(userId!).subscribe({
      next: (favourites) => {
        console.log('FavouritesComponent_getFavouriteMenuItems()_favourites: ', favourites);
        this.favouriteMenuItems.update(() => favourites as FavouriteMenuItemsType[]);
      },
      error: (e) => {
        console.error('FavouritesComponent_getFavouriteMenuItems()_Error: ', e.error);
        // Network error (e.g., server is down or no internet connection). status code 0 always means that the server is unreachable.
        if (e.status === 0) {
          this.networkError.set(
            'Unable to load favourite menu items. Please check your network connection and try again.',
          );
        } else {
          this.errorMessage.set(e.message);
        }
      },
    });
  }

  onRemoveFromFavourites(favouriteId: number) {
    console.log('FavouritesComponent_onRemoveFromFavourites().');

    let currentId: number = this.accountService.currentUserProfile()!.id;

    this.favouritesService.removeFromFavourite(currentId, favouriteId).subscribe({
      next: (favourites) => {
        console.log('FavouritesComponent_onRemoveFromFavourites()_favourites: ', favourites);
        this.favouriteMenuItems.update((fav) => fav.filter((rem) => rem.favouriteId !== favouriteId));
        console.log(
          'FavouritesComponent_onRemoveFromFavourites()_this.favouriteMenuItems(): ',
          this.favouriteMenuItems(),
        );
      },
      error: (e) => {
        console.error('FavouritesComponent_onRemoveFromFavourites()_Error: ', e);
        if (e.status === 0) {
          this.networkError.set(
            'Unable to remove favourite menu item. Please check your network connection and try again.',
          );
        } else {
          this.errorMessage.set(e.message);
        }

        this.favouritesService.menuItemIdErrorMessages.update((errors) => ({
          ...errors,
          [favouriteId]: e.error.code,
        }));
      },
    });
  }

  onAddToCart(menuItemId: number) {
    console.log('FavouritesComponent_onAddToCart().');
    console.log('FavouritesComponent_onAddToCart()_menuItemId:', menuItemId);

    this.cartService.addItemToCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('FavouritesComponent_onAddToCart()_Item added to cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('FavouritesComponent_onAddToCart()_Error adding item to cart:', error);
        if (error.status === 0) {
          this.networkError.set('Unable to add item to cart. Please check your network connection and try again.');
        } else {
          this.errorMessage.set(error.message);
        }
      },
    });
  }

  onRemoveFromCart(menuItemId: number) {
    console.log('FavouritesComponent_onRemoveFromCart().');
    console.log('FavouritesComponent_onRemoveFromCart()_menuItemId:', menuItemId);

    this.cartService.removeItemFromCart(menuItemId, 1).subscribe({
      next: (cart) => {
        console.log('FavouritesComponent_onRemoveFromCart()_Item removed from cart:', cart);
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('FavouritesComponent_onRemoveFromCart()_Error removing item from cart:', error);
        if (error.status === 0) {
          this.networkError.set('Unable to remove item from cart. Please check your network connection and try again.');
        } else {
          this.errorMessage.set(error.message);
        }
      },
    });
  }

  getItemQuantity(menuItemId: number): number {
    console.log('getItemQuantity().');
    return this.cartService.getItemQuantity(menuItemId);
  }

  getMenuImageUrl(fileName: string): string {
    return `${this.imageBaseUrl}/menus/${fileName}`;
  }
}
