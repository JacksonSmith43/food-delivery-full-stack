import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAnchor } from '@angular/material/button';

import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { AccountService } from '../../../../service/account.service';
import { AuthType } from '../../../../../auth/model/auth-user-type';
import { MyAddressesComponent } from '../../../my-addresses.component';
import { AddressType } from '../../../../../shared/model/address-type';
import { MyAddressService } from '../../../service/my-address.service';

@Component({
  selector: 'app-my-address-modal',
  imports: [ReactiveFormsModule, MatSelectModule, MatAnchor],
  templateUrl: './my-address-modal.component.html',
  styleUrl: './my-address-modal.component.css',
})
export class MyAddressModalComponent {
  accountService = inject(AccountService);
  validatorsService = inject(ValidatorsService);
  myAddressService = inject(MyAddressService);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  isValidChange = signal<boolean>(false);

  readonly addressLabels: string[] = ['Home', 'Granny', 'Friend', 'Work'];

  selectedFormField = this.myAddressService.selectedFormField;
  addressForm = this.validatorsService.addressForm;

  streetName = this.validatorsService.addressForm.controls.streetName;
  postalCode = this.validatorsService.addressForm.controls.postalCode;
  city = this.validatorsService.addressForm.controls.city;
  country = this.validatorsService.addressForm.controls.country;
  label = this.validatorsService.addressForm.controls.label;

  constructor(
    // dialogRef references the opened modal. Allows it so that the modal can be closed and that data can be returned.
    public dialogRef: MatDialogRef<MyAddressesComponent>,
    // MAT_DIALOG_DATA receives the data (address) that it receives from MyAddressesComponent.
    // data: UserType is the data that is received.
    // This is the same as: data = inject<UserType>(MAT_DIALOG_DATA);
    @Inject(MAT_DIALOG_DATA) public data: AuthType,
  ) {}

  // Closes the modal without returning anything.
  onNoClick(): void {
    console.log('MyAddressModalComponent_onNoClick().');
    this.dialogRef.close();
  }

  addAddress(): void {
    console.log('addAddress().');

    try {
      let streetName = this.validatorsService.addressForm.value.streetName;
      let label = this.validatorsService.addressForm.value.label;
      let postalCode = this.validatorsService.addressForm.value.postalCode;
      let city = this.validatorsService.addressForm.value.city;
      let country = this.validatorsService.addressForm.value.country;

      console.log('addAddress()_streetName: ', streetName);
      console.log('addAddress()_label: ', label);

      this.successMessage.set('');
      this.errorMessage.set('');
      this.isValidChange.set(false);

      if (!this.accountService.currentUserProfile()) {
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

      this.myAddressService.addAddress(address).subscribe({
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

  editAddress() {
    console.log('editAddress().');

    let label = this.validatorsService.addressForm.value.label;
    const existingAddresses = this.accountService.currentUserProfile()?.address || [];
    const existingAddressLabel = existingAddresses.find((a) => a.label === label);

    console.log('editAddress()_existingAddressLabel: ', existingAddressLabel);

    // If the label already exists.
    if (existingAddressLabel) {
      this.errorMessage.set('editAddress()_label already exists');
    } else {
      this.addAddress();
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

      this.myAddressService.changeAddress(userId, address).subscribe({
        next: (address) => {
          console.log('replaceAddressWithExistingLabel()_address: ', address);
          this.successMessage.set('The address has successfully been changed.');

          let currentAddresses = this.accountService.currentUserProfile()!.address;

          this.accountService.currentUserProfile.set({
            ...this.accountService.currentUserProfile()!,
            // Replace the old address with the updated one – do not append.
            address: currentAddresses.map((a) => (a.id === (address as AddressType).id ? (address as AddressType) : a)),
          });

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
