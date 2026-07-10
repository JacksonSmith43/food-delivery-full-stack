import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UserProfileType } from '../profile/modal/user-profile-type';
import { ProfileModalComponent } from '../profile/component/profile-modal/profile-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);

  selectedFormField = signal<'email' | 'password' | 'phoneNumber' | undefined>(undefined);
  currentUserProfile = signal<UserProfileType | null>(null);

  email: string = '';
  password: string = '';

  constructor(public dialog: MatDialog) {} // MatDialog opens dialogs/modals.

  changeEmailAddress(newEmail: string) {
    console.log('changeEmailAddress().');
    return this.http.post(`/api/auth/emailChange`, newEmail, {
      responseType: 'text',
    });
  }

  changePassword(currentPassword: string, newPassword: string) {
    console.log('changePassword().');

    const body = {
      currentPassword,
      newPassword,
    };

    return this.http.post<string>(`/api/auth/passwordChange/`, body, {
      responseType: 'text' as 'json',
    });
  }

  getCurrentUserProfile(): Observable<UserProfileType> {
    return this.http.get<UserProfileType>(`/api/user/account/profile/me`);
  }

  changePhoneNumber(phoneNumber: string) {
    console.log('changePhoneNumber().');

    return this.http.post(`/api/user/account/profile/changePhoneNumber`, phoneNumber, {
      responseType: 'text',
    });
  }

  openDialog(formField: 'email' | 'password' | 'phoneNumber'): void {
    console.log('openDialog().');

    this.selectedFormField.set(formField);

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
}
