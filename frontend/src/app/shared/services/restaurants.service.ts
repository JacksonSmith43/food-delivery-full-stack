import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoryType, MenuItemsType, RestaurantType } from '../model/restaurants-type.module';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);

  restaurants = signal<RestaurantType[]>([]);
  plz = signal<string>('');
  categories = signal<CategoryType[]>([]);
  menuItems = signal<MenuItemsType[]>([]);
  filteredDietaryLabelByRestaurants = signal<Map<string, number>>(new Map([[' ', 0]]));

  getAllRestaurants(): Observable<RestaurantType[]> {
    console.log('RestaurantsService_getAllRestaurants().');
    return this.http.get<RestaurantType[]>('/api/restaurants/');
  }

  getUniqueCategories(restaurants: RestaurantType[]): CategoryType[] {
    console.log('getUniqueCategories().');

    // Extracts all categories from all restaurants.
    // flatMap takes each restaurant, gets its categories array, and flattens them into a single array.
    // Example: [{categories: [A, B]}, {categories: [B, C]}] -> [A, B, B, C]
    const allCategories = restaurants.flatMap((r) => r.categories);

    // Removes duplicates by creating a Map with category names as keys.
    // Map ensures uniqueness - if a category name already exists, it won't be added again.
    // Key: category name (string), Value: full CategoryType object.
    const uniqueMap = new Map<string, CategoryType>();

    // Iterates through all categories and adds only the first occurrence of each unique name.
    allCategories.forEach((cat) => {
      // Checks if this category name is already in the Map.
      if (!uniqueMap.has(cat.categorie)) {
        // If not present, add it with the category name as key and full object as value.
        uniqueMap.set(cat.categorie, cat);
      }
      // If already present, skip it (this removes duplicates).
    });

    // Converts Map values back to an array of CategoryType objects.
    // Array.from extracts only the values (CategoryType objects) from the Map
    return Array.from(uniqueMap.values());
  }

  filterByCategory(restaurants: RestaurantType[], selectedCategory: CategoryType): RestaurantType[] {
    console.log('filterByCategory().');

    // Only when the selected category matches the restaurant's category will the filter return true.
    return restaurants.filter((r) => r.categories.some((c) => c.categorie === selectedCategory.categorie));
  }

  filterByRestaurantMenuItems(selectedRestaurant: RestaurantType): void {
    console.log('filterByRestaurantMenuItems().');

    this.restaurants.set([selectedRestaurant]);
    console.log('filterByRestaurantMenuItems()_selectedRestaurant: ', selectedRestaurant.restaurantName);

    let menuItems = this.restaurants().flatMap((r) => r.menuItems);

    this.localStorageService.saveToLocalStorage('chosenRestaurant', [selectedRestaurant]);
    this.localStorageService.saveToLocalStorage('menuItemsofChosenRestaurant', menuItems);

    this.menuItems.set(menuItems);
  }

  filterDietaryLabelByRestaurants(value: string): RestaurantType[] {
    console.log('RestaurantsService_filterDietaryLabelByRestaurants().');

    // Filters the menuItems to the corresponding label that was selected.
    let filterByDietaryLabels = this.restaurants().flatMap((restaurant) =>
      restaurant.menuItems.filter((label) => label.dietaryLabels.includes(value.toUpperCase())),
    );
    console.log('RestaurantsService_filterDietaryLabelByRestaurants()_filterByDietaryLabels: ', filterByDietaryLabels);

    // Filters the restaurants to the corresponding label that was selected.
    let filteredRestaurantsByDietaryLabels: RestaurantType[] = this.restaurants().filter((restaurant) =>
      restaurant.menuItems.some((label) => label.dietaryLabels.includes(value.toUpperCase())),
    );
    console.log(
      'RestaurantsService_filterDietaryLabelByRestaurants()_filteredRestaurantsByDietaryLabels: ',
      filteredRestaurantsByDietaryLabels,
    );

    this.restaurants.set(filteredRestaurantsByDietaryLabels);
    return filteredRestaurantsByDietaryLabels;
  }

  // This method counts how many times each dietary label appears across all restaurants and their menu items.
  countDietaryLabels(): void {
    console.log('RestaurantsService_countDietaryLabels().');

    let mapped = new Map<string, number>();

    this.restaurants().flatMap((restaurant) => {
      restaurant.menuItems.map((menu) => {
        menu.dietaryLabels.forEach((label) => {
          // Example: map.set('VEGAN', 5);

          // 1. round — 'VEGAN' is not in Map yet.
          // map.get('VEGAN')(  // → undefined.
          // (undefined ?? 0) // → 0 (because undefined, takes the fallback 0).
          // (0 + 1) // → 1
          // map.set('VEGAN', 1); // → Map: { VEGAN: 1 }

          // 2. round — 'VEGAN' already exists.
          // map.get('VEGAN')(  // → 1
          // (1 ?? 0) // → 1 (not undefined, so no fallback).
          // (1 + 1) // → 2
          // map.set('VEGAN', 2) // → Map: { VEGAN: 2 }
          mapped.set(label, (mapped.get(label) ?? 0) + 1);
        });
      });
    });

    let mappedArray = Array.from(mapped.entries());
    console.log('RestaurantsService_countDietaryLabels()_mapped: ', mapped);
    console.log('RestaurantsService_countDietaryLabels()_mappedArray: ', mappedArray);

    // This displays the labels.
    this.filteredDietaryLabelByRestaurants.set(new Map(mapped));
  }
}
