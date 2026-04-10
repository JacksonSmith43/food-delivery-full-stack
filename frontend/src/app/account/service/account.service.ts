import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UserProfileType } from '../profile/modal/user-profile-type';
import { AddressType } from '../../shared/model/address-type';
import { ProfileModalComponent } from '../profile/component/profile-modal/profile-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);

  selectedFormField = signal<'email' | 'password' | 'address' | 'phoneNumber' | undefined>(undefined);
  currentUserProfile = signal<UserProfileType | null>(null);

  email: string = '';
  password: string = '';
  address: string = '';

  constructor(public dialog: MatDialog) {} // MatDialog opens dialogs/modals.

  changeEmailAddress(currentEmail: string, newEmail: string) {
    console.log('changeEmailAddress().');
    return this.http.post(`/api/auth/emailChange/${currentEmail}`, newEmail, {
      responseType: 'text',
    });
  }

  changePassword(currentPassword: string, newPassword: string, email: string) {
    console.log('changePassword().');

    const body = {
      email,
      currentPassword,
      newPassword,
    };

    return this.http.post<string>(`/api/auth/passwordChange/`, body, {
      responseType: 'text' as 'json',
    });
  }

  getUserProfile(email: string): Observable<string> {
    return this.http.get(`/api/user/account/profile/${email}`, { responseType: 'text' });
  }

  addAddress(address: AddressType, email: string) {
    console.log('addAddress().');

    return this.http.post(`/api/user/account/profile/addAddress/${email}`, address, {
      responseType: 'text',
    });
  }

  changePhoneNumber(email: string, phoneNumber: string) {
    console.log('changePhoneNumber().');

    return this.http.post(`/api/user/account/profile/changePhoneNumber/${email}`, phoneNumber, {
      responseType: 'text',
    });
  }

  changeAddress(userId: number, newAddress: AddressType) {
    console.log('changeAddress().');

    return this.http.put(`/api/user/account/profile/changeAddress/${userId}`, newAddress);
  }

  openDialog(formField: 'email' | 'password' | 'address' | 'phoneNumber'): void {
    console.log('openDialog().');

    this.selectedFormField.set(formField);

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

  deleteAddress(addressId: number): Observable<AddressType[]> {
    console.log('AccountService_deleteAddress().');
    return this.http.delete<AddressType[]>(`/api/user/account/address/deleteAddress/${addressId}`);
  }
}
