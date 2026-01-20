import { Component, inject, OnInit } from '@angular/core';

import { RestaurantsService } from '../service/restaurants.service';
import { LocalStorage } from '../../shared/services/local-storage.service';
import { RestaurantType } from '../../shared/model/restaurants-type.module';

@Component({
  selector: 'app-restaurants',
  imports: [],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css',
})
export class Restaurant implements OnInit {
  private restaurantsService = inject(RestaurantsService);
  localStorageService = inject(LocalStorage);

  restaurants = this.restaurantsService.restaurants;

  ngOnInit(): void {
    console.log('Restaurant_ngOnInit().');
    console.log('Restaurant_ngOnInit()_this.restaurants().', this.restaurants());

    let restaurants: RestaurantType[] = this.localStorageService.getRestaurants('restaurants');

    if (restaurants && restaurants.length > 0) {
      this.restaurants.set(restaurants);
      console.log('Restaurant_ngOnInit()_restaurants: ', restaurants);
    }
  }
}
