import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';

import { UserType } from '../../../../auth/model/user-type';
import { ProfileComponent } from '../../profile.component/profile.component';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [MatAnchor],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent {
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
    this.dialogRef.close();
  }
}
