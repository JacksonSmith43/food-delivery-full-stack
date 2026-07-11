import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoryType, MenuItemsType, RestaurantType } from '../model/restaurants-type.module';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  // This only gets used to get all images and to get filtered but not changed.
  allRestaurants = signal<RestaurantType[]>([]);
  // This is used for filtering the restaurants using the allRestaurants as a filter and this then gets displayed.
  filteredRestaurants = signal<RestaurantType[]>([]);
  filteredDietaryLabelByRestaurants = signal<Map<string, number>>(new Map([[' ', 0]]));
  plz = signal<string>('');
  categories = signal<CategoryType[]>([]);
  menuItems = signal<MenuItemsType[]>([]);
  filteredMenuItems = signal<MenuItemsType[]>([]);
  filteredDietaryLabelByMenuItem = signal<Map<string, number>>(new Map([[' ', 0]]));

  getAllRestaurants(): Observable<RestaurantType[]> {
    console.log('RestaurantsService_getAllRestaurants().');
    return this.http.get<RestaurantType[]>(`${this.apiBaseUrl}/api/restaurants/`);
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
    console.log('filterByCategory()_restaurants: ', restaurants);
    console.log('filterByCategory()_selectedCategory: ', selectedCategory);

    // Only when the selected category matches the restaurant's category will the filter return true.
    return restaurants.filter((r) => r.categories.some((c) => c.categorie === selectedCategory.categorie));
  }

  filterByRestaurantMenuItems(selectedRestaurant: RestaurantType): void {
    console.log('filterByRestaurantMenuItems().');

    this.filteredRestaurants.set([selectedRestaurant]);
    console.log('filterByRestaurantMenuItems()_selectedRestaurant: ', selectedRestaurant.restaurantName);

    let menuItems = this.allRestaurants().flatMap((r) =>
      r.restaurantName.includes(selectedRestaurant.restaurantName) ? r.menuItems : [],
    );

    this.localStorageService.saveToLocalStorage('chosenRestaurant', [selectedRestaurant]);
    this.localStorageService.saveToLocalStorage('menuItemsofChosenRestaurant', menuItems);

    this.menuItems.set(menuItems);
  }

  filterDietaryLabelByRestaurants(value: string): RestaurantType[] {
    console.log('RestaurantsService_filterDietaryLabelByRestaurants().');

    // Filters the menuItems to the corresponding label that was selected.
    let filterByDietaryLabels = this.allRestaurants().flatMap((restaurant) =>
      restaurant.menuItems.filter((label) => label.dietaryLabels.includes(value.toUpperCase())),
    );
    console.log('RestaurantsService_filterDietaryLabelByRestaurants()_filterByDietaryLabels: ', filterByDietaryLabels);

    // Filters the restaurants to the corresponding label that was selected.
    let filteredRestaurantsByDietaryLabels: RestaurantType[] = this.allRestaurants().filter((restaurant) =>
      restaurant.menuItems.some((label) => label.dietaryLabels.includes(value.toUpperCase())),
    );
    console.log(
      'RestaurantsService_filterDietaryLabelByRestaurants()_filteredRestaurantsByDietaryLabels: ',
      filteredRestaurantsByDietaryLabels,
    );

    this.filteredRestaurants.set(filteredRestaurantsByDietaryLabels);
    return filteredRestaurantsByDietaryLabels;
  }

  // This method counts how many times each dietary label appears across all restaurants and their menu items.
  countDietaryLabelsForRestaurants(): void {
    console.log('RestaurantsService_countDietaryLabelsForRestaurants().');

    let mapped = new Map<string, number>();

    this.filteredRestaurants().flatMap((restaurant) => {
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

    console.log('RestaurantsService_countDietaryLabelsForRestaurants()_mapped: ', mapped);

    // This displays the labels.
    this.filteredDietaryLabelByRestaurants.set(new Map(mapped));
  }

  filterDietaryLabelByMenuItem(value: string): MenuItemsType[] {
    console.log('RestaurantsService_filterDietaryLabelByMenuItem().');
    console.log('RestaurantsService_filterDietaryLabelByMenuItem()_this.menuItems(): ', this.menuItems());

    // Filters the menuItems to the corresponding label that was selected.
    let filterByDietaryLabels: MenuItemsType[] = this.menuItems().filter((menuItem) =>
      menuItem.dietaryLabels.includes(value.toUpperCase()),
    );

    this.filteredMenuItems.set(filterByDietaryLabels);
    console.log('RestaurantsService_filterDietaryLabelByMenuItem()_filterByDietaryLabels: ', filterByDietaryLabels);

    return filterByDietaryLabels;
  }

  countDietaryLabelsForMenuItems(): void {
    console.log('RestaurantsService_countDietaryLabels().');

    let mapped = new Map<string, number>();

    this.filteredMenuItems().map((menuItem) => {
      menuItem.dietaryLabels.forEach((label) => {
        mapped.set(label, (mapped.get(label) ?? 0) + 1);
      });
    });

    console.log('RestaurantsService_countDietaryLabelsForMenuItems()_mapped: ', mapped);

    // This displays the labels.
    this.filteredDietaryLabelByMenuItem.set(new Map(mapped));
  }
}
