import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { FavouriteMenuItemsType } from '../model/favourite-menu-items-type';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  menuItemIds = signal<number[]>([]);
  favouriteMenuItems = signal<FavouriteMenuItemsType[]>([]);
  errorMessage = signal<string>('');
  menuItemIdErrorMessages = signal<Record<number, string>>({});

  addToFavourite(userId: number, menuItemIds: number) {
    console.log('addToFavourite().');
    return this.http.post(`${this.apiBaseUrl}/api/favourites/addToFavourites/${userId}`, menuItemIds);
  }

  removeFromFavourite(userId: number, menuItemIds: number) {
    console.log('removeFromFavourite().');
    return this.http.post(`${this.apiBaseUrl}/api/favourites/removeFromFavourites/${userId}`, menuItemIds);
  }

  getFavouriteMenuItemIds(userId: number) {
    console.log('FavouritesService_getFavouriteMenuItemIds().');

    return this.http.get(`${this.apiBaseUrl}/api/favourites/${userId}`);
  }

  getFavouriteMenuItems(userId: number) {
    console.log('FavouritesService_getFavouriteMenuItems().');

    return this.http.get(`${this.apiBaseUrl}/api/allFavourites/${userId}`);
  }
}
