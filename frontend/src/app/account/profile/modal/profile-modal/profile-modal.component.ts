import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAnchor } from "@angular/material/button";

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
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserType,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
