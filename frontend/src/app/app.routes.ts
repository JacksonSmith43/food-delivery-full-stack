import { Routes } from '@angular/router';

import { RestaurantDetailComponent } from './restaurants/components/restaurant-detail/restaurant-detail.component';
import { RestaurantComponent } from './restaurants/components/restaurant.component';
import { CartComponent } from './cart/cart.component/cart.component';
import { SearchRestaurant } from './search-restaurant/search-restaurant.component';
import { RegisterComponent } from './auth/register/register-component/register-component';
import { LoginComponent } from './auth/login/login.component/login.component';
import { AccountComponent } from './account/component/account.component';
import { ProfileComponent } from './account/profile/component/profile/profile.component';
import { OrdersComponent } from './account/orders/component/orders.component';
import { MyAddressesComponent } from './account/my-addresses/my-addresses.component';
import { FavouritesComponent } from './account/favourites/favourites.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },

  { path: '', component: SearchRestaurant },

  { path: 'allRestaurants', component: RestaurantComponent },
  { path: 'restaurant/:restaurantName', component: RestaurantDetailComponent },
  { path: 'account', component: AccountComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'myAddresses', component: MyAddressesComponent },
  { path: 'favourites', component: FavouritesComponent },
];
