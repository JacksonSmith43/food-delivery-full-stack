import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { RestaurantType } from '../../shared/model/restaurants-type.module';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  http = inject(HttpClient);

  restaurants = signal<RestaurantType[]>([]);

  getAllRestaurants() {
    console.log('getAllRestaurants().');
    return this.http.get<RestaurantType[]>('/api/restaurants/');
  }
}
