import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { UserType } from '../../../../auth/model/user-type';
import { ProfileComponent } from '../../profile.component/profile.component';
import { AccountService } from '../../../service/account.service';
import { AuthService } from '../../../../auth/service/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [MatAnchor, ReactiveFormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent {
  accountService = inject(AccountService);
  authService = inject(AuthService);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  isValidChange = signal<boolean>(false);

  selectedFormField = this.accountService.selectedFormField;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [
      ...this.getPasswordValidators(),
      this.currentPasswordChecker.bind(this),
    ] as ValidatorFn[]),

    newPassword: new FormControl('', [
      ...this.getPasswordValidators(),
      this.differentFromCurrentPassword.bind(this), // bind(this) is required so that currentUser can be accessed in the custom validator. Otherwise, 'this' would be undefined in the custom validator.
    ] as ValidatorFn[]),
  });

  public getPasswordValidators(): ValidatorFn[] {
    return [Validators.required, Validators.minLength(6), Validators.maxLength(30)];
  }

  // Custom Validator.
  differentFromCurrentPassword(control: FormControl): { [key: string]: boolean } | null {
    console.log('differentFromCurrentPassword().');

    const newPassword = control.value;
    const currentPassword = this.authService.currentUser()?.password;

    if (newPassword && currentPassword && newPassword === currentPassword) {
      return { sameAsCurrentPassword: true };
    }

    return null;
  }

  currentPasswordChecker(control: FormControl): { [key: string]: boolean } | null {
    console.log('currentPasswordChecker().');

    const currentPasswordInput = control.value;
    const currentPassword = this.authService.currentUser()?.password;

    // If this statement is true then the user has entered an incorrect current password. The error 'differentCurrentPassword' is added to the form control, which can be used in the template to display an error message.
    if (currentPasswordInput !== currentPassword) {
      return { differentCurrentPassword: true };
    }

    return null;
  }

  constructor(
    // dialogRef references the opened modal. Allows it so that the modal can be closed and that data can be returned.
    public dialogRef: MatDialogRef<ProfileComponent>,
    // MAT_DIALOG_DATA receives the data (email, password) that it receives from ProfileComponent.
    // data: UserType is the data that is received.
    // This is the same as: data = inject<UserType>(MAT_DIALOG_DATA);
    @Inject(MAT_DIALOG_DATA) public data: UserType,
  ) {}

  // Closes the modal without returning anything.
  onNoClick(): void {
    console.log('onNoClick().');
    this.dialogRef.close();
  }

  onChangeEmail() {
    console.log('onChangeEmail().');

    try {
      if (this.emailForm.valid) {
        let newEmail = this.emailForm.value.email;
        this.selectedFormField.set('email');

        let currentEmail = this.authService.currentUser()?.email;

        this.accountService.changeEmailAddress(currentEmail!, newEmail!).subscribe({
          next: (response) => {
            console.log('changeEmailAddress()_Response: ', response);
            this.successMessage.set('Your Email address has successfully been changed.');
            this.isValidChange.set(true);

            const currentUserData = this.authService.currentUser();
            if (currentUserData) {
              this.authService.currentUser.set({ ...currentUserData, email: newEmail! });
              sessionStorage.setItem(
                'userCredentials',
                JSON.stringify(this.authService.currentUser()),
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

  onChangePassword() {
    console.log('onChangePassword().');

    try {
      if (this.passwordForm.valid) {
        let newPassword = this.passwordForm.value.newPassword;
        this.selectedFormField.set('password');

        let currentPassword = this.authService.currentUser()?.password;

        this.accountService.changePassword(currentPassword!, newPassword!).subscribe({
          next: (response) => {
            console.log('onChangePassword()_Response: ', response);
            this.successMessage.set('Your password has successfully been changed.');
            this.isValidChange.set(true);

            const currentUserData = this.authService.currentUser();
            if (currentUserData) {
              this.authService.currentUser.set({ ...currentUserData, password: newPassword! });
              sessionStorage.setItem(
                'userCredentials',
                JSON.stringify(this.authService.currentUser()),
              );
            }
          },
          error: (e) => {
            console.error('onChangePassword()_Error: ', e);
            this.errorMessage.set('An error occurred. Please try again.');
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

  get emailIsInvalid() {
    console.log('emailIsInvalid().');

    if (this.emailForm.controls.email.hasError('required')) {
      return 'An input is required.';
    } else if (this.emailForm.controls.email.hasError('email')) {
      return 'It has to be a valid email address.';
    } else {
      return '';
    }
  }

  get currentPasswordIsInvalid() {
    console.log('currentPasswordIsInvalid().');

    if (this.passwordForm.controls.currentPassword.hasError('required')) {
      return 'An input is required.';
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
      return 'An input is required.';
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
}
