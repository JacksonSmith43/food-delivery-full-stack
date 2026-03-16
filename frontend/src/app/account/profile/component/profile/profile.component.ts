import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService } from '../../../../auth/service/auth.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { AccountService } from '../../../service/account.service';
import { UserProfileType } from '../../modal/user-profile-type';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  locaStorage = inject(LocalStorageService);

  accountService = inject(AccountService);

  selectedFormField = this.accountService.selectedFormField;
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

  email: string = '';
  password: string = '';
  address: string = '';

  passwordLength = computed(() => {
    let authUserPassword = this.authService.authUser()?.password;
    return authUserPassword ? authUserPassword.length : 0;
  });

  constructor(public dialog: MatDialog) {} // MatDialog opens dialogs/modals.

  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);

      this.accountService.getUserProfile(userCredentials.email).subscribe({
        next: (user) => {
          console.log('AccountComponent_ngOnInit()_user: ', user);

          let userProfile: UserProfileType = JSON.parse(user) as UserProfileType;
          console.log('AccountComponent_ngOnInit()_userProfile: ', userProfile);

          // let address = userProfile.address;
          // console.log('AccountComponent_ngOnInit()_address: ', address);
          this.currentUserProfile.set(userProfile);
        },
      });
    }
  }

  openDialog(formField: 'email' | 'password' | 'address' | 'phoneNumber'): void {
    console.log('openDialog().');

    this.accountService.selectedFormField.set(formField);

    // ProfileModalComponent is the component that should be displayed when clicking on the modal field.
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      width: '80%',
      data: { email: this.email, password: this.password, address: this.address },
    });

    // Returns an observable when the user closes the modal.
    // result hold the data that the modal returns after it closes.
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // The returned result will be saved as a new password.
      this.password = result;
    });
  }

  getPasswordLength() {
    // console.log('getPasswordLength().');
    return Array(this.passwordLength()).fill(0);
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
