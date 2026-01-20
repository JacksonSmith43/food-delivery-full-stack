import { Component } from '@angular/core';

import { Navbar } from './navbar/navbar.component';
import { SearchRestaurant } from './search-restaurant/search-restaurant.component';
import { Restaurant } from './restaurants/components/restaurant.component';

@Component({
  selector: 'app-root',
  imports: [Navbar, SearchRestaurant, Restaurant],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {}
