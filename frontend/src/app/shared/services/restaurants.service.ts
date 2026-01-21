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
  categories = signal<string[]>([]);

  getAllRestaurants() {
    console.log('RestaurantsService_getAllRestaurants().');
    return this.http.get<RestaurantType[]>('/api/restaurants/');
  }

  getUniqueCategories(restaurants: RestaurantType[]): string[] {
    console.log('getUniqueCategories().');
    const allCategories = restaurants.flatMap((r) => r.category.split(',').map((c) => c.trim()));
    return [...new Set(allCategories)];
  }

  filterByCategory(restaurants: RestaurantType[], selectedCategory: string): RestaurantType[] {
    console.log('filterByCategory().');
    // Only when the selected category matches the restaurant's category will the filter return true;
    return restaurants.filter((r) =>
      r.category
        .split(',')
        .map((c) => c.trim())
        .includes(selectedCategory),
    );
  }
}
