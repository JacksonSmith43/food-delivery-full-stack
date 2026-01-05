import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { SearchRestaurant } from "./search-restaurant/search-restaurant";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SearchRestaurant],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
