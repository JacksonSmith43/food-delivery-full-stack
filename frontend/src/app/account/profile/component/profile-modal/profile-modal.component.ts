import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { AuthType } from '../../../../auth/model/auth-user-type';
import { ProfileComponent } from '../profile/profile.component';
import { AccountService } from '../../../service/account.service';
import { AuthService } from '../../../../auth/service/auth.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { AddressType } from '../../../../shared/model/address-type';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [MatAnchor, ReactiveFormsModule, MatSelectModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent {
  accountService = inject(AccountService);
  authService = inject(AuthService);
  validatorsService = inject(ValidatorsService);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  isValidChange = signal<boolean>(false);

  readonly addressLabels: string[] = ['Home', 'Granny', 'Friend', 'Work'];

  selectedFormField = this.accountService.selectedFormField;

  passwordForm = this.validatorsService.passwordForm;
  emailForm = this.validatorsService.emailForm;
  addressForm = this.validatorsService.addressForm;
  phoneNumberForm = this.validatorsService.phoneNumberForm;

  currentPassword = this.validatorsService.passwordForm.controls.currentPassword;
  newPassword = this.validatorsService.passwordForm.controls.newPassword;
  email = this.validatorsService.emailForm.controls.email;

  streetName = this.validatorsService.addressForm.controls.streetName;
  postalCode = this.validatorsService.addressForm.controls.postalCode;
  city = this.validatorsService.addressForm.controls.city;
  country = this.validatorsService.addressForm.controls.country;
  label = this.validatorsService.addressForm.controls.label;

  phoneNumber = this.validatorsService.phoneNumberForm.controls.phoneNumber;

  constructor(
    // dialogRef references the opened modal. Allows it so that the modal can be closed and that data can be returned.
    public dialogRef: MatDialogRef<ProfileComponent>,
    // MAT_DIALOG_DATA receives the data (email, password) that it receives from ProfileComponent.
    // data: UserType is the data that is received.
    // This is the same as: data = inject<UserType>(MAT_DIALOG_DATA);
    @Inject(MAT_DIALOG_DATA) public data: AuthType,
  ) {}

  // Closes the modal without returning anything.
  onNoClick(): void {
    console.log('onNoClick().');
    this.dialogRef.close();
  }

  onChangeEmail(): void {
    console.log('onChangeEmail().');

    try {
      if (this.validatorsService.emailForm.valid) {
        let newEmail = this.validatorsService.emailForm.value.email;
        this.selectedFormField.set('email');

        let currentEmail = this.authService.authUser()?.email;

        this.accountService.changeEmailAddress(currentEmail!, newEmail!).subscribe({
          next: (response) => {
            console.log('changeEmailAddress()_Response: ', response);
            this.successMessage.set('Your Email address has successfully been changed.');
            this.isValidChange.set(true);

            const authUserData = this.authService.authUser();
            if (authUserData) {
              this.authService.authUser.set({ ...authUserData, email: newEmail! });
              sessionStorage.setItem(
                'userCredentials',
                JSON.stringify(this.authService.authUser()),
              );
            }
          },
          error: (e) => {
            console.error('changeEmailAddress()_Error: ', e);
            this.errorMessage.set('An error occurred. Please try again.');
          },
        });

        setTimeout(() => {
          this.dialogRef.close(newEmail);
          this.successMessage.set('');
          this.errorMessage.set('');
        }, 2000);

        console.log('onChangeEmail()_newEmail: ', newEmail);
      }
    } catch (error) {
      console.error('onChangeEmail()_Error: ', error);
    }
  }

  onChangePassword(): void {
    console.log('onChangePassword().');

    try {
      if (this.validatorsService.passwordForm.valid) {
        let newPassword = this.validatorsService.passwordForm.value.newPassword;
        this.selectedFormField.set('password');

        let currentPassword = this.authService.authUser()?.password;
        let email = this.authService.authUser()?.email;

        this.accountService.changePassword(currentPassword!, newPassword!, email!).subscribe({
          next: (response) => {
            console.log('onChangePassword()_Response: ', response);

            if (response === null) {
              console.log(
                'onChangePassword()_Response is null. This means that the current password is incorrect.',
              );
              this.errorMessage.set(response);
              return;
            }

            this.successMessage.set('Your password has successfully been changed.');
            this.isValidChange.set(true);

            const authUserData = this.authService.authUser();
            if (authUserData) {
              this.authService.authUser.set({ ...authUserData, password: newPassword! });
              sessionStorage.setItem(
                'userCredentials',
                JSON.stringify(this.authService.authUser()),
              );
            }
          },
          error: (e) => {
            console.error('onChangePassword()_Error: ', e);
            this.errorMessage.set('An error occurred. Please try again. Error: ' + e.message);
          },
        });

        setTimeout(() => {
          this.dialogRef.close(newPassword);
          this.successMessage.set('');
          this.errorMessage.set('');
        }, 2000);

        console.log('onChangePassword()_newPassword: ', newPassword);
      }
    } catch (error) {
      console.error('onChangePassword()_Error: ', error);
    }
  }

  addAddress(): void {
    console.log('addAddress().');

    try {
      let streetName = this.validatorsService.addressForm.value.streetName;
      let label = this.validatorsService.addressForm.value.label;
      let postalCode = this.validatorsService.addressForm.value.postalCode;
      let city = this.validatorsService.addressForm.value.city;
      let country = this.validatorsService.addressForm.value.country;

      let currentEmail = this.accountService.currentUserProfile()?.email;

      console.log('addAddress()_streetName: ', streetName);
      console.log('addAddress()_label: ', label);

      if (streetName && label && postalCode && city && country && currentEmail) {
        this.isValidChange.set(true);

        let address: AddressType = {
          label,
          streetName,
          postalCode,
          city,
          country,
        };

        this.accountService.addAddress(address, currentEmail).subscribe({
          next: (address) => {
            console.log('addAddress()_address: ', address);
            this.successMessage.set('Your address has successfully been added.');

            let newAdress: AddressType = JSON.parse(address);
            let currentAddresses = this.accountService.currentUserProfile()!.address || [];

            this.accountService.currentUserProfile.set({
              ...this.accountService.currentUserProfile()!,
              address: [...currentAddresses, newAdress],
            });
          },
          error: (error) => {
            console.error('addAddress()_subscribe_Error: ', error.error);
            this.errorMessage.set(error.error);
            this.isValidChange.set(false);
          },
        });

        setTimeout(() => {
          this.dialogRef.close({ streetName, postalCode, label, city, country });
          this.successMessage.set('');
          this.errorMessage.set('');
          this.isValidChange.set(false);
        }, 2000);
      } else {
        console.log('addAddress()_Invalid Input: Address input or address label is missing.');
        this.errorMessage.set('Please provide all address fields.');
        return;
      }
    } catch (error) {
      console.error('addAddress()_Error: ', error);
    }
  }

  getAddressLabel(): string[] {
    // console.log('getAddressLabel().');

    for (let a = 0; this.addressLabels.length; a++) {
      return this.addressLabels;
    }
    return [];
  }

  onChangePhoneNumber() {
    console.log('onChangePhoneNumber().');

    let phoneNumber = this.validatorsService.phoneNumberForm.controls.phoneNumber.value;
    let email = this.accountService.currentUserProfile()?.email;
    let userProfile = this.accountService.currentUserProfile();

    if (email && phoneNumber) {
      this.accountService.changePhoneNumber(email, phoneNumber).subscribe({
        next: (phoneNumber) => {
          console.log('onChangePhoneNumber()_phoneNumber: ', phoneNumber);
          this.isValidChange.set(true);
          this.successMessage.set('Phone number successfully changed.');
          this.accountService.currentUserProfile.set({
            ...userProfile!,
            phoneNumber,
          });
        },
        error: (e) => {
          console.error('onChangePhoneNumber()_Error: ', e.error);

          this.successMessage.set('');
          this.errorMessage.set(e.error);
          this.isValidChange.set(false);
        },
      });

      setTimeout(() => {
        this.dialogRef.close(phoneNumber);
        this.successMessage.set('');
        this.isValidChange.set(false);
      }, 2000);
    }
  }
}
