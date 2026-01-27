import { Routes } from '@angular/router';

import { RestaurantDetailComponent } from './restaurants/components/restaurant-detail/restaurant-detail.component';
import { Restaurant } from './restaurants/components/restaurant.component';

export const routes: Routes = [
  // { path: '' LoginComponent},
  // { path: '/login' LoginComponent}
  { path: 'allRestaurants', component: Restaurant },
  { path: 'restaurant/:restaurantName', component: RestaurantDetailComponent },
];
