import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { FavouriteMenuItemsType } from '../model/favourite-menu-items-type';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  http = inject(HttpClient);

  menuItemIds = signal<number[]>([]);
  favouriteMenuItems = signal<FavouriteMenuItemsType>({} as FavouriteMenuItemsType);
  errorMessage = signal<string>('');
  menuItemIdErrorMessages = signal<Record<number, string>>({});

  addToFavourite(userId: number, menuItemIds: number) {
    console.log('addToFavourite().');
    return this.http.post(`/api/favourites/addToFavourites/${userId}`, menuItemIds);
  }

  removeFromFavourite(userId: number, menuItemIds: number) {
    console.log('removeFromFavourite().');
    return this.http.post(`/api/favourites/removeFromFavourites/${userId}`, menuItemIds);
  }

  getFavouriteMenuItemIds(userId: number) {
    console.log('FavouritesService_getFavouriteMenuItemIds().');

    return this.http.get(`/api/favourites/${userId}`);
  }

  getFavouriteMenuItems(userId: number) {
    console.log('FavouritesService_getFavouriteMenuItems().');

    return this.http.get(`/api/allFavourites/${userId}`);
  }
}
