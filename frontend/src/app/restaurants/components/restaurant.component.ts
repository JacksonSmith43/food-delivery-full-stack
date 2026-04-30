import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

import { RestaurantsService } from '../../shared/services/restaurants.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { CategoryType, RestaurantType } from '../../shared/model/restaurants-type.module';
import { NavBarService } from '../../navbar/service/navbar.service';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [MatChipsModule, TitleCasePipe, UpperCasePipe],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css',
})
export class RestaurantComponent implements OnInit {
  private restaurantsService = inject(RestaurantsService);
  localStorageService = inject(LocalStorageService);
  navbarService = inject(NavBarService);
  authService = inject(AuthService);
  router = inject(Router);

  restaurants = this.restaurantsService.restaurants;
  categories = this.restaurantsService.categories;
  menuItems = this.restaurantsService.menuItems;
  filteredDietaryLabelByRestaurants = this.restaurantsService.filteredDietaryLabelByRestaurants;

  ngOnInit(): void {
    console.log('Restaurant_ngOnInit().');
    console.log('Restaurant_ngOnInit()_this.restaurants().', this.restaurants());

    let userCredentials = this.localStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);
    }

    let restaurants: RestaurantType[] = this.localStorageService.getRestaurants('restaurants');

    if (restaurants && restaurants.length > 0) {
      this.restaurants.set(restaurants);
      console.log('Restaurant_ngOnInit()_restaurants: ', restaurants);

      const uniqueCategories = this.restaurantsService.getUniqueCategories(restaurants);
      this.restaurantsService.categories.set(uniqueCategories);
      console.log('RestaurantComponent_ngOnInit()_uniqueCategories: ', uniqueCategories);
    } else {
      this.navbarService.getAllRestaurants();
    }
    this.restaurantsService.countDietaryLabels();
    this.navbarService.getAllRestaurants();
  }

  onCategoryClick(category: CategoryType) {
    console.log('onCategoryClick().');

    this.restaurantsService.getAllRestaurants().subscribe((restaurants) => {
      const filtered = this.restaurantsService.filterByCategory(restaurants, category);
      this.restaurantsService.restaurants.set(filtered);
    });
  }

  onRestaurantClick(selectedRestaurant: RestaurantType) {
    console.log('onMenuClick().');

    this.restaurantsService.filterByRestaurantMenuItems(selectedRestaurant);
    this.router.navigate(['/restaurant/' + selectedRestaurant.restaurantName]);
  }

  onFilterDietaryChange(event: MatChipListboxChange): RestaurantType[] {
    console.log('RestaurantComponent_onFilterDietaryChange().');
    console.log('RestaurantComponent_onFilterDietaryChange()_value: ', event.value);

    let value: string = event.value;
    return this.restaurantsService.filterDietaryLabelByRestaurants(value);
  }
}
