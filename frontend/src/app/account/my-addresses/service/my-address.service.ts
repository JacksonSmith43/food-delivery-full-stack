import { inject, Injectable, signal } from '@angular/core';
import { AddressType } from '../../../shared/model/address-type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { MyAddressModalComponent } from '../modal/component/my-address-modal.component/my-address-modal.component';

@Injectable({
  providedIn: 'root',
})
export class MyAddressService {
  http = inject(HttpClient);

  selectedFormField = signal<'address' | undefined>(undefined);

  address: string = '';

  constructor(public dialog: MatDialog) {} // MatDialog opens dialogs/modals.

  addAddress(address: AddressType) {
    console.log('MyAddressService_addAddress().');

    return this.http.post(`/api/user/account/profile/addAddress`, address, {
      responseType: 'text',
    });
  }

  changeAddress(userId: number, newAddress: AddressType) {
    console.log('MyAddressService_changeAddress().');

    return this.http.put(`/api/user/account/profile/changeAddress/${userId}`, newAddress);
  }

  deleteAddress(addressId: number): Observable<AddressType[]> {
    console.log('MyAddressService_deleteAddress().');
    return this.http.delete<AddressType[]>(`/api/user/account/address/deleteAddress/${addressId}`);
  }

  openDialog(formField: 'address'): void {
    console.log('openDialog().');

    this.selectedFormField.set(formField);

    // MyAddressModalComponent is the component that should be displayed when clicking on the modal field.
    const dialogRef = this.dialog.open(MyAddressModalComponent, {
      width: '80%',
      data: { address: this.address },
    });

    // Returns an observable when the user closes the modal.
    // result hold the data that the modal returns after it closes.
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // The returned result will be saved as a new password.
      this.address = result;
    });
  }
}
