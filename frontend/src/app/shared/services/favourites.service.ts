import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  http = inject(HttpClient);

  isFavourite = signal<boolean>(false);
  menuItemIds = signal<number[]>([]);

  addToFavourite(userId: number, menuItemIds: number) {
    console.log('addToFavourite().');
    return this.http.post(`/api/favourites/addToFavourites/${userId}`, menuItemIds);
  }

  removeFromFavourite(userId: number, menuItemIds: number) {
    console.log('removeFromFavourite().');
    return this.http.post(`/api/favourites/removeFromFavourites/${userId}`, menuItemIds);
  }
}
