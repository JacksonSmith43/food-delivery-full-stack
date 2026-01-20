import { Injectable } from '@angular/core';
import { RestaurantType } from '../model/restaurants-type.module';

@Injectable({ providedIn: 'root' })
export class LocalStorage {
  getRestaurants(key: 'restaurants') {
    console.log('getRestaurants().');

    let savedRestaurants = localStorage.getItem(key);

    if (savedRestaurants) {
      try {
        console.log('getRestaurants()_savedRestaurants (raw string):', savedRestaurants);
        const parsed = JSON.parse(savedRestaurants);
        console.log('getRestaurants()_parsed:', parsed);
        console.log('getRestaurants()_parsed type:', typeof parsed);
        console.log('getRestaurants()_is Array?:', Array.isArray(parsed));
        return parsed;
      } catch (error) {
        console.error(`getRestaurants()_Error: ${key}`, error);
      }
    }
    return [];
  }

  saveToLocalStorage(key: 'restaurants', restaurants: RestaurantType[]) {
    console.log('saveToLocalStorage().');
    try {
      localStorage.setItem(key, JSON.stringify(restaurants));
    } catch (error) {
      console.error('saveToLocalStorage()_Error: ', error);
    }
  }
}
