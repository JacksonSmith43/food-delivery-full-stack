import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavBarService } from './service/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  private navBarService = inject(NavBarService);

  onGetAllRestaurants() {
    console.log('onGetAllRestaurants().');
    this.navBarService.getAllRestaurants();
  }
}
