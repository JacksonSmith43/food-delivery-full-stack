import { Component, computed, inject, OnInit } from '@angular/core';

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

  menuItemIds = this.favouritesService.menuItemIds;
  favouriteMenuItems = this.favouritesService.favouriteMenuItems;

  favouriteMenuItemsComputed = computed(() => this.favouriteMenuItems());

  ngOnInit(): void {
    console.log('FavouritesComponent_ngOnInit().');

    let userCredentials = this.locaStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);

      this.accountService.getUserProfile(userCredentials.email).subscribe({
        next: (user) => {
          console.log('FavouritesComponent_ngOnInit()_user: ', user);
          this.accountService.currentUserProfile.set(JSON.parse(user));
          this.getFavouriteMenuItems();
        },
        error: (error) => {
          console.error('FavouritesComponent_ngOnInit()_Error loading profile: ', error.error.message);
        },
      });
    }
  }

  getFavouriteMenuItems() {
    console.log('FavouritesComponent_getFavouriteMenuItems().');

    let userId = this.accountService.currentUserProfile()?.id;

    this.favouritesService.getFavouriteMenuItems(userId!).subscribe({
      next: (favourites) => {
        console.log('FavouritesComponent_getFavouriteMenuItems()_favourites: ', favourites);
        // this.favouriteMenuItems.update(...favourites);
      },
      error: (e) => {
        console.error('FavouritesComponent_getFavouriteMenuItems()_Error: ', e.error);
      },
    });
  }
}
