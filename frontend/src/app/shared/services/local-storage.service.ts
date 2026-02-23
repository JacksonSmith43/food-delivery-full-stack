import { inject, Injectable } from '@angular/core';

import { MenuItemsType, RestaurantType } from '../model/restaurants-type.module';
import { AuthType } from '../../auth/model/auth-user-type';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  authService = inject(AuthService);

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

  getUserCredentials(): AuthType {
    console.log('getUserCredentials().');
    
    let userCredentials = sessionStorage.getItem('userCredentials');
    console.log('getUserCredentials()_userCredentials', userCredentials);

    let userCredentialsParse: AuthType = userCredentials ? JSON.parse(userCredentials) : null;
    console.log('getUserCredentials()_userCredentialsParse', userCredentialsParse);

    return userCredentialsParse;
  }
}
