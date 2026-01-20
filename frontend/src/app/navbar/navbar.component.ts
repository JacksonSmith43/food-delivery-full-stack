import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LocalStorage } from '../shared/services/local-storage.service';
import { RestaurantsService } from '../restaurants/service/restaurants.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  private localStorageService = inject(LocalStorage);
  private restaurantsService = inject(RestaurantsService);

  restaurants = this.restaurantsService.restaurants;

  onGetAllRestaurants() {
    console.log('onGetAllRestaurants().');

    this.restaurantsService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        console.log('onGetAllRestaurants()_next.');
        this.localStorageService.saveToLocalStorage('restaurants', restaurants as any);
        this.restaurants.set(restaurants);
        console.log('onGetAllRestaurants()_restaurants: ', restaurants);
      },
      error: (error) => console.error('onGetAllRestaurants()_Error: ', error),
    });
  }
}
