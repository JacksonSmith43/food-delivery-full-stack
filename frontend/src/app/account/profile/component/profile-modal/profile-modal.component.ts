import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { A11yModule } from '@angular/cdk/a11y';

import { AuthType } from '../../../../auth/model/auth-user-type';
import { ProfileComponent } from '../profile/profile.component';
import { AccountService } from '../../../service/account.service';
import { AuthService } from '../../../../auth/service/auth.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [MatAnchor, ReactiveFormsModule, MatSelectModule, A11yModule, MatDialogModule],
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

  selectedFormField = this.accountService.selectedFormField;

  passwordForm = this.validatorsService.passwordForm;
  emailForm = this.validatorsService.emailForm;
  phoneNumberForm = this.validatorsService.phoneNumberForm;

  currentPassword = this.validatorsService.passwordForm.controls.currentPassword;
  newPassword = this.validatorsService.passwordForm.controls.newPassword;
  email = this.validatorsService.emailForm.controls.email;

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
    console.log('ProfileModalComponent_onNoClick().');
    this.dialogRef.close();
  }

  onChangeEmail(): void {
    console.log('onChangeEmail().');

    try {
      if (this.validatorsService.emailForm.valid) {
        let newEmail = this.validatorsService.emailForm.value.email;
        this.selectedFormField.set('email');

        this.accountService.changeEmailAddress(newEmail!).subscribe({
          next: (response) => {
            this.successMessage.set('Your Email address has successfully been changed.');
            this.isValidChange.set(true);

            const authUserData = this.authService.authUser();
            if (authUserData) {
              this.authService.authUser.set({ ...authUserData, email: newEmail! });
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
        let currentPassword = this.validatorsService.passwordForm.value.currentPassword;

        this.selectedFormField.set('password');

        this.successMessage.set('');
        this.errorMessage.set('');
        this.isValidChange.set(false);

        this.accountService.changePassword(currentPassword!, newPassword!).subscribe({
          next: (response) => {
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
            }
            setTimeout(() => {
              this.dialogRef.close(newPassword);
              this.successMessage.set('');
              this.errorMessage.set('');
            }, 2000);
          },
          error: (e) => {
            console.error('onChangePassword()_error_Error: ', e);
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

  onChangePhoneNumber() {
    console.log('onChangePhoneNumber().');

    let phoneNumber = this.validatorsService.phoneNumberForm.controls.phoneNumber.value;
    let userProfile = this.accountService.currentUserProfile();

    this.successMessage.set('');
    this.errorMessage.set('');
    this.isValidChange.set(false);

    if (this.phoneNumberForm.invalid) {
      this.phoneNumberForm.markAllAsTouched();
      return;
    }

    if (!userProfile) {
      this.errorMessage.set('User profile is not loaded. Please reopen the profile page.');
      return;
    }

    if (phoneNumber != null) {
      console.log('phoneNumber', phoneNumber);
      this.accountService.changePhoneNumber(phoneNumber).subscribe({
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
}
