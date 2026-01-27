import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Navbar } from './navbar/navbar.component';
import { SearchRestaurant } from './search-restaurant/search-restaurant.component';
import { Restaurant } from './restaurants/components/restaurant.component';
import { RestaurantsService } from './shared/services/restaurants.service';

@Component({
  selector: 'app-root',
  imports: [Navbar, SearchRestaurant, Restaurant, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  restaurantService = inject(RestaurantsService);
  constructor(public router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
}
