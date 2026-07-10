import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  route = inject(ActivatedRoute);

  allRestaurants = this.restaurantsService.allRestaurants;
  categories = this.restaurantsService.categories;
  menuItems = this.restaurantsService.menuItems;
  filteredDietaryLabelByRestaurants = this.restaurantsService.filteredDietaryLabelByRestaurants;
  filteredRestaurants = this.restaurantsService.filteredRestaurants;

  enteredPlz = '';

  ngOnInit(): void {
    console.log('Restaurant_ngOnInit().');

    // This is required, in order to filter the plz in this component. This extracts the plz from the URL and saves it in the enteredPlz variable.
    this.route.params.subscribe((params) => {
      // plz has to match the name that is in app.routes: path: 'restaurants/:plz'
      this.enteredPlz = params['plz'];
      console.log('Restaurant_ngOnInit()_this.enteredPlz: ', this.enteredPlz);
    });

    console.log('Restaurant_ngOnInit()_this.filteredRestaurants().', this.filteredRestaurants());

    let restaurants: RestaurantType[] = this.localStorageService.getRestaurants('restaurants');

    if (restaurants && restaurants.length > 0) {
      this.allRestaurants.set(restaurants);
      this.filteredRestaurants.set(restaurants);
      console.log('Restaurant_ngOnInit()_restaurants: ', restaurants);

      const uniqueCategories = this.restaurantsService.getUniqueCategories(restaurants);
      this.restaurantsService.categories.set(uniqueCategories);
      console.log('RestaurantComponent_ngOnInit()_uniqueCategories: ', uniqueCategories);
    }

    this.restaurantsService.countDietaryLabelsForRestaurants();
  }

  onCategoryClick(category: CategoryType) {
    console.log('onCategoryClick().');
    console.log('onCategoryClick()_this.enteredPlz: ', this.enteredPlz);

    let filteredCategories = this.allRestaurants().map((restaurants) => {
      let filter = this.enteredPlz
        ? this.restaurantsService
            .filterByCategory([restaurants], category)
            .filter((restaurant) => restaurant.plz === this.enteredPlz)
        : this.restaurantsService.filterByCategory([restaurants], category);

      return filter;
    });
    let filteredCategoriesFlattened = filteredCategories.flatMap((restaurant) => restaurant);
    this.filteredRestaurants.set(filteredCategoriesFlattened);
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

    // When all chips have been deselected, the value will be undefined. Then all restaurants should be visible again, within that postalcode.
    if (value === undefined) {
      this.filteredRestaurants.set([
        ...(this.enteredPlz ? this.allRestaurants().filter((r) => r.plz === this.enteredPlz) : this.allRestaurants()),
      ]);
      return this.filteredRestaurants();
    }

    return this.restaurantsService.filterDietaryLabelByRestaurants(value);
  }
}
