import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { ProfileModalComponent } from '../modal/profile-modal/profile-modal.component';
import { AuthService } from '../../../auth/service/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AccountService } from '../../service/account.service';

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

  email: string = '';
  password: string = '';

  passwordLength = computed(() => {
    let currentUserPassword = this.authService.currentUser()?.password;
    return currentUserPassword ? currentUserPassword.length : 0;
  });

  constructor(public dialog: MatDialog) {} // MatDialog opens dialogs/modals.

  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.currentUser.set(userCredentials);
    }
  }

  openDialog(formField: 'email' | 'password'): void {
    console.log('openDialog().');

    this.accountService.selectedFormField.set(formField);

    // ProfileModalComponent is the component that should be displayed when clicking on the modal field.
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      width: '80%',
      data: { email: this.email, password: this.password },
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
    console.log('getPasswordLength().');
    return Array(this.passwordLength()).fill(0);
  }
}
