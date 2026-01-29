import { Component, inject } from '@angular/core';

import { RestaurantsService } from '../../../shared/services/restaurants.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css',
})
export class RestaurantDetailComponent {
  restaurantService = inject(RestaurantsService);

  menuItems = this.restaurantService.menuItems;
  restaurant = this.restaurantService.restaurants;

  getCurrentRestaurant(): string[] {
    return this.restaurant().map((r) => r.restaurantName);
  }

  getCurrentRestaurantImage(): string[] {
    return this.restaurant().map((r) => r.imageName);
  }
}
