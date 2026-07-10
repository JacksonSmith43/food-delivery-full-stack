import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { AccountService } from '../../account/service/account.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  accountService = inject(AccountService);

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [...this.getPasswordValidators()] as ValidatorFn[]),

    newPassword: new FormControl('', [
      ...this.getPasswordValidators(),
      this.differentFromCurrentPassword.bind(this), // bind(this) is required so that authUser can be accessed in the custom validator. Otherwise, 'this' would be undefined in the custom validator.
    ] as ValidatorFn[]),
  });

  addressForm = new FormGroup({
    streetName: new FormControl('', [
      ...this.getAddressValidators(),
      this.currentAddressChecker.bind(this),
    ] as ValidatorFn[]),
    label: new FormControl('', [Validators.required] as ValidatorFn[]),
    postalCode: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(23)]),
    city: new FormControl('', [...this.getAddressValidators()] as ValidatorFn[]),
    country: new FormControl('', [...this.getAddressValidators()] as ValidatorFn[]),
  });

  phoneNumberForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });

  public getPasswordValidators(): ValidatorFn[] {
    console.log('getPasswordValidators().');
    return [Validators.required, Validators.minLength(6), Validators.maxLength(30)];
  }

  public getAddressValidators(): ValidatorFn[] {
    console.log('getAddressValidators().');
    return [Validators.required, Validators.minLength(3), Validators.maxLength(50)];
  }

  // Custom Validator.
  differentFromCurrentPassword(control: FormControl): { [key: string]: boolean } | null {
    console.log('differentFromCurrentPassword().');

    const newPassword = control.value;
    const currentPassword = control.parent?.get('currentPassword')?.value;

    if (newPassword && currentPassword && newPassword === currentPassword) {
      return { sameAsCurrentPassword: true };
    }

    return null;
  }

  currentAddressChecker(control: FormControl): { [key: string]: boolean } | null {
    console.log('currentAddressChecker().');

    const currentAddressInput = control.value;
    const currentAddress = this.accountService.currentUserProfile()?.address;

    if (currentAddressInput === currentAddress) {
      return { sameAsCurrentAddress: true };
    }

    return null;
  }

  get emailIsInvalid() {
    console.log('emailIsInvalid().');

    if (this.emailForm.controls.email.hasError('required')) {
      return 'An email input is required.';
    } else if (this.emailForm.controls.email.hasError('email')) {
      return 'It has to be a valid email address.';
    } else {
      return '';
    }
  }

  get currentPasswordIsInvalid() {
    console.log('currentPasswordIsInvalid().');

    if (this.passwordForm.controls.currentPassword.hasError('required')) {
      return 'A current password is required.';
    } else if (this.passwordForm.controls.currentPassword.hasError('minlength')) {
      return 'Has to contain at least 6 characters.';
    } else if (this.passwordForm.controls.currentPassword.hasError('maxlength')) {
      return 'Is allowed to contain maximum 30 characters.';
    } else if (this.passwordForm.controls.currentPassword.hasError('differentCurrentPassword')) {
      return 'Current password is incorrect.';
    } else {
      return '';
    }
  }

  get newPasswordIsInvalid() {
    console.log('newPasswordIsInvalid().');

    if (this.passwordForm.controls.newPassword.hasError('required')) {
      return 'A new password is required.';
    } else if (this.passwordForm.controls.newPassword.hasError('minlength')) {
      return 'Has to contain at least 6 characters.';
    } else if (this.passwordForm.controls.newPassword.hasError('maxlength')) {
      return 'Is allowed to contain maximum 30 characters.';
    } else if (this.passwordForm.controls.newPassword.hasError('sameAsCurrentPassword')) {
      return 'Has to be different than the previous password.';
    } else {
      return '';
    }
  }

  get streetNameIsInvalid() {
    console.log('streetNameIsInvalid().');

    if (this.addressForm.controls.streetName.hasError('required')) {
      return 'A street name is required.';
    } else if (this.addressForm.controls.streetName.hasError('minlength')) {
      return 'Has to contain at least 3 characters.';
    } else if (this.addressForm.controls.streetName.hasError('maxlength')) {
      return 'Is allowed to contain maximum 50 characters.';
    } else if (this.addressForm.controls.streetName.hasError('sameAsCurrentAddress')) {
      return 'Has to be different than the previous address.';
    } else {
      return '';
    }
  }

  get addressLabelIsInvalid() {
    console.log('addressLabelIsInvalid().');

    if (this.addressForm.controls.label.hasError('required')) {
      return 'A selection of a place is required.';
    } else {
      return '';
    }
  }

  get postalCodeIsInvalid() {
    console.log('postalCodeIsInvalid().');

    if (this.addressForm.controls.postalCode.hasError('required')) {
      return 'A postalCode input is required.';
    } else if (this.addressForm.controls.postalCode.hasError('min')) {
      return 'Too low. Has to between 1 and 23';
    } else if (this.addressForm.controls.postalCode.hasError('max')) {
      return 'Too high. Has to between 1 and 23.';
    } else {
      return '';
    }
  }

  get cityIsInvalid() {
    console.log('cityIsInvalid().');

    if (this.addressForm.controls.city.hasError('required')) {
      return 'A city is required.';
    } else if (this.addressForm.controls.city.hasError('minlength')) {
      return 'Has to contain at least 3 characters.';
    } else if (this.addressForm.controls.city.hasError('maxlength')) {
      return 'Is allowed to contain maximum 50 characters.';
    } else {
      return '';
    }
  }

  get countryIsInvalid() {
    console.log('countryIsInvalid().');

    if (this.addressForm.controls.country.hasError('required')) {
      return 'A country is required.';
    } else if (this.addressForm.controls.country.hasError('minlength')) {
      return 'Has to contain at least 3 characters.';
    } else if (this.addressForm.controls.country.hasError('maxlength')) {
      return 'Is allowed to contain maximum 50 characters.';
    } else {
      return '';
    }
  }

  get phoneNumberIsInvalid() {
    console.log('phoneNumberIsInvalid().');

    if (this.phoneNumberForm.controls.phoneNumber.hasError('required')) {
      return 'A phone number input is required.';
    } else if (this.phoneNumberForm.controls.phoneNumber.hasError('minlength')) {
      return 'Too few. Has to between 1 and 20 numbers.';
    } else if (this.phoneNumberForm.controls.phoneNumber.hasError('maxlength')) {
      return 'Too many. Has to between 1 and 20 numbers.';
    } else {
      return '';
    }
  }
}
