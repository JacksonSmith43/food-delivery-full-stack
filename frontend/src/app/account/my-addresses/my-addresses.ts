import { Component, computed, inject, ViewChild } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { AccountService } from '../service/account.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../auth/service/auth.service';
import { PopupComponent } from './components/address-popup/popup/popup';

@Component({
  selector: 'app-my-addresses',
  imports: [MatAnchor, MatIcon, PopupComponent],
  templateUrl: './my-addresses.html',
  styleUrl: './my-addresses.css',
})
export class MyAddressesComponent {
  accountService = inject(AccountService);
  locaStorageService = inject(LocalStorageService);
  authService = inject(AuthService);

  currentUserProfile = this.accountService.currentUserProfile;

  @ViewChild(PopupComponent) popup!: PopupComponent;
  // Holds the address ID temporarily until user confirms deletion in the popup.
  pendingDeleteId: number | null = null;

  // The addressOrder object defines the desired order of address labels. <string, number> means that the keys are strings and the values are numbers.
  addressOrder: Record<string, number> = {
    Home: 1,
    Work: 2,
    Granny: 3,
    Friend: 4,
  };

  allAddresses = computed(() => {
    let addresses = this.accountService.currentUserProfile()?.address;
    return addresses;
  });

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

  // User clicks delete button on one address card.
  onDeleteAddress(id: number): void {
    console.log('MyAddressesComponent_onDeleteAddress().');

    if (id == null) {
      return;
    }

    // Store the ID now; we will call HTTP delete only after confirmation.
    this.pendingDeleteId = id;
    this.openPopup();
  }

  // Runs only when popup emits (confirmed).
  onPopupConfirmed(): void {
    console.log('MyAddressesComponent_onPopupConfirmed().');

    if (this.pendingDeleteId == null) {
      return;
    }

    const addressId = this.pendingDeleteId;
    this.accountService.deleteAddress(addressId).subscribe({
      next: (updatedAddresses) => {
        console.log('MyAddressesComponent_onPopupConfirmed()_updatedAddresses: ', updatedAddresses);
      
        const profile = this.accountService.currentUserProfile();
        if (profile) {
          this.accountService.currentUserProfile.set({ ...profile, address: updatedAddresses });
        }
        this.pendingDeleteId = null;
      },
      error: (e) => {
        console.error('MyAddressesComponent_onDeleteAddress_Error: ', e.message);
        this.pendingDeleteId = null;
      },
    });
  }

  // Parent opens child popup.
  openPopup() {
    console.log('MyAddressesComponent_openPopup().');
    this.popup.open('Deletion', 'Are you sure you wish to delete this address.');
  }

  // Informational callback after popup closed (confirm or cancel).
  onPopupClosed() {
    console.log('MyAddressesComponent_onPopupClosed().');
  }
}
