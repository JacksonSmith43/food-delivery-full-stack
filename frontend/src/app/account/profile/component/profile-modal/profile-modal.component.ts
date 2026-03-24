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
              sessionStorage.setItem('userCredentials', JSON.stringify(this.authService.authUser()));
            }

            setTimeout(() => {
              this.dialogRef.close(newEmail);
              this.successMessage.set('');
              this.errorMessage.set('');
            }, 2000);
          },
          error: (e) => {
            console.error('changeEmailAddress()_Error: ', e);
            this.errorMessage.set(JSON.parse(e.error).code);
            // this.errorMessage.set('An error occurred. Please try again.');
          },
        });

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

        this.successMessage.set('');
        this.errorMessage.set('');
        this.isValidChange.set(false);

        this.accountService.changePassword(currentPassword!, newPassword!, email!).subscribe({
          next: (response) => {
            console.log('onChangePassword()_Response: ', response);

            if (response === null) {
              console.log('onChangePassword()_Response is null. This means that the current password is incorrect.');
              this.errorMessage.set(response);
              return;
            }

            this.successMessage.set('Your password has successfully been changed.');
            this.isValidChange.set(true);

            const authUserData = this.authService.authUser();
            if (authUserData) {
              this.authService.authUser.set({ ...authUserData, password: newPassword! });
              sessionStorage.setItem('userCredentials', JSON.stringify(this.authService.authUser()));
            }
            setTimeout(() => {
              this.dialogRef.close(newPassword);
              this.successMessage.set('');
              this.errorMessage.set('');
            }, 2000);
          },
          error: (e) => {
            console.error('onChangePassword()_Error: ', e);
            this.errorMessage.set(JSON.parse(e.error).code);
            // this.errorMessage.set('An error occurred. Please try again. Error: ' + e.message);
          },
        });

        console.log('onChangePassword()_newPassword: ', newPassword);
      } else {
        this.passwordForm.markAllAsTouched();
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

      this.successMessage.set('');
      this.errorMessage.set('');
      this.isValidChange.set(false);

      if (!currentEmail) {
        this.errorMessage.set('User profile is not loaded. Please reopen the profile page.');
        return;
      }

      if (this.addressForm.invalid) {
        console.log('addAddress()_form value: ', this.addressForm.value);
        console.log('addAddress()_form errors: ', this.addressForm.errors);
        console.log('addAddress()_streetName errors: ', this.streetName.errors);
        console.log('addAddress()_postalCode errors: ', this.postalCode.errors);
        console.log('addAddress()_city errors: ', this.city.errors);
        console.log('addAddress()_country errors: ', this.country.errors);
        console.log('addAddress()_label errors: ', this.label.errors);

        this.addressForm.markAllAsTouched();
        this.errorMessage.set('Please fix the highlighted address fields.');
        return;
      }

      this.isValidChange.set(true);

        const safeStreetName = streetName!;
        const safeLabel = label!;
        const safePostalCode = postalCode!;
        const safeCity = city!;
        const safeCountry = country!;

        let address: AddressType = {
          label: safeLabel,
          streetName: safeStreetName,
          postalCode: safePostalCode,
          city: safeCity,
          country: safeCountry,
        };
        console.log('addAddress()_address: ', address);

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

            setTimeout(() => {
              this.dialogRef.close({
                streetName: safeStreetName,
                postalCode: safePostalCode,
                label: safeLabel,
                city: safeCity,
                country: safeCountry,
              });

              this.successMessage.set('');
              this.errorMessage.set('');
              this.isValidChange.set(false);
            }, 2000);
          },
          error: (error) => {
            console.error('addAddress()_subscribe_Error: ', error.error);

            const code =
              typeof error.error === 'string'
                ? (() => {
                    try {
                      return JSON.parse(error.error).code;
                    } catch {
                      return error.error;
                    }
                  })()
                : error.error?.code;

            this.errorMessage.set(code || 'An unexpected error occurred.');

          if (code === 'ADDRESS_LABEL_EXISTS') {
            this.errorMessage.set(
              'This label already exists. Only one of each label can be used once. In order to replace the previous address with this new one, press the Change Address button.',
            );
          }
          this.isValidChange.set(false);
        },
      });
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

    this.successMessage.set('');
    this.errorMessage.set('');
    this.isValidChange.set(false);

    if (this.phoneNumberForm.invalid) {
      this.phoneNumberForm.markAllAsTouched();
      return;
    }

    if (!email) {
      this.errorMessage.set('User profile is not loaded. Please reopen the profile page.');
      return;
    }

    if (email && phoneNumber != null) {
      console.log('phoneNumber', phoneNumber);
      this.accountService.changePhoneNumber(email, phoneNumber).subscribe({
        next: (phoneNumber) => {
          console.log('onChangePhoneNumber()_phoneNumber: ', phoneNumber);
          this.isValidChange.set(true);
          this.successMessage.set('Phone number successfully changed.');
          this.accountService.currentUserProfile.set({
            ...userProfile!,
            phoneNumber,
          });

          setTimeout(() => {
            this.dialogRef.close(phoneNumber);
            this.successMessage.set('');
            this.isValidChange.set(false);
          }, 2000);
        },
        error: (e) => {
          console.error('onChangePhoneNumber()_Error: ', e.error);

          const code =
            typeof e.error === 'string'
              ? (() => {
                  try {
                    return JSON.parse(e.error).code;
                  } catch {
                    return e.error;
                  }
                })()
              : e.error?.code;

          this.errorMessage.set(code || 'An unexpected error occurred.');
          this.isValidChange.set(false);
        },
      });
    } else {
      this.phoneNumberForm.markAllAsTouched();
      this.errorMessage.set('Please fix the highlighted phone number field.');
    }
  }

  replaceAddressWithExistingLabel() {
    console.log('replaceAddressWithExistingLabel().');

    let userId = this.accountService.currentUserProfile()?.id;
    const existingAddresses = this.accountService.currentUserProfile()?.address || [];

    let streetName = this.validatorsService.addressForm.value.streetName;
    let label = this.validatorsService.addressForm.value.label;
    let postalCode = this.validatorsService.addressForm.value.postalCode;
    let city = this.validatorsService.addressForm.value.city;
    let country = this.validatorsService.addressForm.value.country;

    console.log('replaceAddressWithExistingLabel()_streetName: ', streetName);
    console.log('replaceAddressWithExistingLabel()_label: ', label);

    this.successMessage.set('');
    this.isValidChange.set(false);
    this.errorMessage.set('');

    const existingAddressId = existingAddresses.find((a) => a.label === label)?.id; // The id of the already existing label that that wants to be added.

    if (this.addressForm.valid && userId && existingAddressId) {
      this.isValidChange.set(true);

      const safeStreetName = streetName!;
      const safeLabel = label!;
      const safePostalCode = postalCode!;
      const safeCity = city!;
      const safeCountry = country!;

      let address: AddressType = {
        id: existingAddressId,
        label: safeLabel,
        streetName: safeStreetName,
        postalCode: safePostalCode,
        city: safeCity,
        country: safeCountry,
      };

      this.accountService.changeAddress(userId, address).subscribe({
        next: (address) => {
          console.log('replaceAddressWithExistingLabel()_address', address);
          this.successMessage.set('The address has successfully been changed.');

          setTimeout(() => {
            this.dialogRef.close(address);
            this.successMessage.set('');
            this.isValidChange.set(false);
          }, 2000);
        },
        error: (error) => {
          console.error('replaceAddressWithExistingLabel()_Error', error.error);
          this.successMessage.set('');
          const code =
            typeof error.error === 'string'
              ? (() => {
                  try {
                    return JSON.parse(error.error).code;
                  } catch {
                    return error.error;
                  }
                })()
              : error.error?.code;

          this.errorMessage.set(code || 'An unexpected error occurred.');
          this.isValidChange.set(false);
        },
      });
    } else {
      this.addressForm.markAllAsTouched();
      this.errorMessage.set('replaceAddressWithExistingLabel()_No existing address was found for this label.');
    }
  }
}
