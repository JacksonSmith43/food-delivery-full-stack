import { Component, inject, OnInit } from '@angular/core';

import { FavouritesService } from '../../shared/services/favourites.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../auth/service/auth.service';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-favourites',
  imports: [],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
})
export class FavouritesComponent implements OnInit {
  favouritesService = inject(FavouritesService);
  locaStorageService = inject(LocalStorageService);
  authService = inject(AuthService);
  accountService = inject(AccountService);

  ngOnInit(): void {
    console.log('FavouritesComponent_ngOnInit().');

    let userCredentials = this.locaStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);

      this.accountService.getUserProfile(userCredentials.email).subscribe({
        next: (user) => {
          console.log('FavouritesComponent_ngOnInit()_user: ', user);
          this.accountService.currentUserProfile.set(JSON.parse(user));
        },
        error: (error) => {
          console.error('FavouritesComponent_ngOnInit()_Error loading profile: ', error.error.message);
        },
      });
    }
  }
}
