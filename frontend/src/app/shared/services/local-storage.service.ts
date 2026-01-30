import { Injectable } from '@angular/core';
import { MenuItemsType, RestaurantType } from '../model/restaurants-type.module';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  getRestaurants(key: 'restaurants'): RestaurantType[] {
    console.log('getRestaurants().');

    let savedRestaurants = localStorage.getItem(key);

    if (savedRestaurants) {
      try {
        console.log('getRestaurants()_savedRestaurants (raw string):', savedRestaurants);
        const parsed = JSON.parse(savedRestaurants);

        return parsed;
      } catch (error) {
        console.error(`getRestaurants()_Error: ${key}`, error);
      }
    }
    return [];
  }

  getCurrentRestaurant(key: 'chosenRestaurant'): RestaurantType[] {
    console.log('getCurrentRestaurant().');

    let savedRestaurants = localStorage.getItem(key);

    if (savedRestaurants) {
      try {
        console.log('getCurrentRestaurant()_savedRestaurants (raw string):', savedRestaurants);
        const parsed = JSON.parse(savedRestaurants);
        return parsed;
      } catch (error) {
        console.error(`getCurrentRestaurant()_Error: ${key}`, error);
      }
    }
    return [];
  }

  getMenuItems(key: 'menuItemsofChosenRestaurant'): MenuItemsType[] {
    console.log('getMenuItems().');

    let savedMenuItems = localStorage.getItem(key);

    if (savedMenuItems) {
      try {
        console.log('getMenuItems()_savedMenuItems (raw string):', savedMenuItems);
        const parsed = JSON.parse(savedMenuItems);

        return parsed;
      } catch (error) {
        console.error(`getMenuItems()_Error: ${key}`, error);
      }
    }
    return [];
  }

  saveToLocalStorage(
    key: 'restaurants' | 'chosenRestaurant' | 'menuItemsofChosenRestaurant',
    value: RestaurantType[] | MenuItemsType[],
  ) {
    console.log('saveToLocalStorage().');
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('saveToLocalStorage()_Error: ', error);
    }
  }
}
