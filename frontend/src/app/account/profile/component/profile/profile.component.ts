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

  userAddress = computed(() =>
    this.currentUserProfile()?.address.map(
      (a) =>
        'Street name: ' +
        a.streetName +
        ' PLZ: ' +
        a.postalCode +
        ' City: ' +
        a.city +
        ' Country: ' +
        a.country +
        ' Label: ' +
        a.label,
    ),
  );

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
}
