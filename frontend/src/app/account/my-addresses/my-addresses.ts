import { Component, computed, inject } from '@angular/core';

import { AccountService } from '../service/account.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-my-addresses',
  imports: [],
  templateUrl: './my-addresses.html',
  styleUrl: './my-addresses.css',
})
export class MyAddressesComponent {
  accountService = inject(AccountService);
  locaStorageService = inject(LocalStorageService);
  authService = inject(AuthService);

  currentUserProfile = this.accountService.currentUserProfile;

  // The addressOrder object defines the desired order of address labels. <string, number> means that the keys are strings and the values are numbers.
  addressOrder: Record<string, number> = {
    Home: 1,
    Work: 2,
    Granny: 3,
    Friend: 4,
  };

  sortedAddresses = computed(() => {
    const addresses = this.currentUserProfile()?.address ?? [];
    return [...addresses].sort(
      // sort calls the function multiple times/loops. It compares two elements.
      // this.addressOrder[a.label] is the equivalent to addressOrder['Home'] which returns 1.
      // 999 means that unknown labels will be last.
      (a, b) => (this.addressOrder[a.label] ?? 999) - (this.addressOrder[b.label] ?? 999),
    );
  });

  ngOnInit(): void {
    console.log('MyAddressesComponent_ngOnInit().');

    let userCredentials = this.locaStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);

      this.accountService.getUserProfile(userCredentials.email).subscribe({
        next: (user) => {
          console.log('MyAddressesComponent_ngOnInit()_user: ', user);
          this.accountService.currentUserProfile.set(JSON.parse(user));
        },
        error: (error) => {
          console.error('MyAddressesComponent_ngOnInit()_Error loading profile: ', error.error.message);
        },
      });
    }
  }

  formatAddress(a: {
    label: string;
    streetName: string;
    postalCode: string | number;
    city: string;
    country: string;
  }): string {
    return `${a.streetName}, ${a.postalCode}, ${a.city}, ${a.country}`;
  }
}
