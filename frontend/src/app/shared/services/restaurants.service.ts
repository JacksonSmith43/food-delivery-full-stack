import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { RestaurantType } from '../model/restaurants-type.module';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);

  restaurants = signal<RestaurantType[]>([]);
  plz = signal<string>('');

  getAllRestaurants() {
    console.log('RestaurantsService_getAllRestaurants().');
    return this.http.get<RestaurantType[]>('/api/restaurants/');
  }
}
