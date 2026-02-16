import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    this.selectedFormField.set('password');
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
}
