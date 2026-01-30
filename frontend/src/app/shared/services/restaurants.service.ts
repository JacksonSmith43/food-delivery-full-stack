import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

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

  getAllRestaurants() {
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

  filterByCategory(
    restaurants: RestaurantType[],
    selectedCategory: CategoryType,
  ): RestaurantType[] {
    console.log('filterByCategory().');

    // Only when the selected category matches the restaurant's category will the filter return true.
    return restaurants.filter((r) =>
      r.categories.some((c) => c.categorie === selectedCategory.categorie),
    );
  }

  filterByRestaurantMenuItems(selectedRestaurant: RestaurantType) {
    console.log('filterByRestaurantMenuItems().');

    this.restaurants.set([selectedRestaurant]);
    console.log(
      'filterByRestaurantMenuItems()_selectedRestaurant: ',
      selectedRestaurant.restaurantName,
    );

    let menuItems = this.restaurants().flatMap((r) => r.menuItems);

    this.localStorageService.saveToLocalStorage('chosenRestaurant', [selectedRestaurant]);
    this.localStorageService.saveToLocalStorage('menuItemsofChosenRestaurant', menuItems);

    this.menuItems.set(menuItems);
  }
}
