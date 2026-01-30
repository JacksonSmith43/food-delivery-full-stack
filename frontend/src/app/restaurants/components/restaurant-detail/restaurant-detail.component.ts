import { Component, inject, OnInit } from '@angular/core';

import { RestaurantsService } from '../../../shared/services/restaurants.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css',
})
export class RestaurantDetailComponent implements OnInit {
  restaurantService = inject(RestaurantsService);
  localStorageService = inject(LocalStorageService);

  menuItems = this.restaurantService.menuItems;
  restaurant = this.restaurantService.restaurants;
  category = this.restaurantService.categories;

  ngOnInit(): void {
    console.log('RestaurantDetailComponent_ngOnInit().');

    let menuItems = this.localStorageService.getMenuItems('menuItemsofChosenRestaurant');
    let restaurant = this.localStorageService.getCurrentRestaurant('chosenRestaurant');

    console.log('RestaurantDetailComponent_ngOnInit()_menuItems: ', menuItems);
    console.log('RestaurantDetailComponent_ngOnInit()_restaurant: ', restaurant);

    this.menuItems.set(menuItems);
    this.restaurant.set(restaurant);
  }

  getCurrentRestaurant(): string[] {
    return this.restaurant().map((r) => r.restaurantName);
  }

  getCurrentRestaurantImage(): string[] {
    return this.restaurant().map((r) => r.imageName);
  }

  getCurrentCategory() {
    console.log('getCurrentCategory().');
    let category = this.restaurant()
      .flatMap((c) => c.categories)
      .map((c) => c.categorie)
      .join(', '); // It combines multiple categories into a single string separated by commas.

    console.log('getCurrentCategory()_category: ', category);
    console.log('getCurrentCategory()_category_typeof: ', typeof category);

    return category;
  }
}
