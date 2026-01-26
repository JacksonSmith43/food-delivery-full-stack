import { Component, inject, OnInit } from '@angular/core';

import { RestaurantsService } from '../../shared/services/restaurants.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { CategoryType, RestaurantType } from '../../shared/model/restaurants-type.module';
import { NavBarService } from '../../navbar/service/navbar.service';

@Component({
  selector: 'app-restaurants',
  imports: [],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css',
})
export class Restaurant implements OnInit {
  private restaurantsService = inject(RestaurantsService);
  localStorageService = inject(LocalStorageService);
  navbarService = inject(NavBarService);

  restaurants = this.restaurantsService.restaurants;
  categories = this.restaurantsService.categories;

  ngOnInit(): void {
    console.log('Restaurant_ngOnInit().');
    console.log('Restaurant_ngOnInit()_this.restaurants().', this.restaurants());

    let restaurants: RestaurantType[] = this.localStorageService.getRestaurants('restaurants');

    if (restaurants && restaurants.length > 0) {
      this.restaurants.set(restaurants);
      console.log('Restaurant_ngOnInit()_restaurants: ', restaurants);
    } else {
      this.navbarService.getAllRestaurants();
    }
  }

  onCategoryClick(category: CategoryType) {
    console.log('onCategoryClick().');

    this.restaurantsService.getAllRestaurants().subscribe((restaurants) => {
      const filtered = this.restaurantsService.filterByCategory(restaurants, category);
      this.restaurantsService.restaurants.set(filtered);
    });
  }
}
