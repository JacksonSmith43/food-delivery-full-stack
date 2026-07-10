import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { NavBarService } from './service/navbar.service';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  private navBarService = inject(NavBarService);
  authService = inject(AuthService);
  router = inject(Router);

  successMessage = this.authService.successMessage;

  onGetAllRestaurants() {
    console.log('onGetAllRestaurants().');
    this.navBarService.getAllRestaurants();
  }

  onLogout() {
    console.log('onLogout().');

    this.authService.logoutUser().subscribe({
      next: () => {
        this.successMessage.set('Logout successful.');
        this.authService.errorMessage.set('');

        setTimeout(() => {
          this.successMessage.set('');
          this.authService.isLoginSuccessful.set(false);
          this.router.navigateByUrl('login');
        }, 1000);
      },
      error: (error) => {
        console.error('Navbar_onLogout()_Error: ', error);
        this.authService.errorMessage.set('Logout failed.');
      },
    });
  }
}
