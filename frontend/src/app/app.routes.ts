import { Routes } from '@angular/router';

import { RestaurantDetailComponent } from './restaurants/components/restaurant-detail/restaurant-detail.component';
import { RestaurantComponent } from './restaurants/components/restaurant.component';
import { CartComponent } from './cart/cart.component/cart.component';
import { SearchRestaurant } from './search-restaurant/search-restaurant.component';

export const routes: Routes = [
  // { path: '' LoginComponent},
  // { path: '/login' LoginComponent}
  { path: '', component: SearchRestaurant },
  { path: 'allRestaurants', component: RestaurantComponent },
  { path: 'restaurant/:restaurantName', component: RestaurantDetailComponent },
  { path: 'cart', component: CartComponent },
];
