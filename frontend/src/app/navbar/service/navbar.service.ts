import { inject, Injectable } from '@angular/core';

import { RestaurantsService } from '../../shared/services/restaurants.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private restaurantsService = inject(RestaurantsService);
  private localStorageService = inject(LocalStorageService);

  getAllRestaurants() {
    console.log('NavBarService_getAllRestaurants().');

    this.restaurantsService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        console.log('NavBarService_getAllRestaurants()_next.');
        this.localStorageService.saveToLocalStorage('restaurants', restaurants as any);
        this.restaurantsService.restaurants.set(restaurants);
        console.log('NavBarService_getAllRestaurants()_restaurants: ', restaurants);
      },
      error: (error) => console.error('NavBarService_getAllRestaurants()_Error: ', error),
    });
  }
}
