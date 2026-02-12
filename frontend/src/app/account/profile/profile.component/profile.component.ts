import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { ProfileModalComponent } from '../modal/profile-modal/profile-modal.component';
import { AuthService } from '../../../auth/service/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

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

  constructor(public dialog: MatDialog) {}

  email: string = '';
  password: string = '';

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      width: '80%',
      data: { email: this.email, password: this.password },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.password = result;
    });
  }

  passwordLength = computed(() => {
    let currentUserPassword = this.authService.currentUser()?.password;
    return currentUserPassword ? currentUserPassword.length : 0;
  });

  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.currentUser.set(userCredentials);
    }
  }

  getPasswordLength() {
    return Array(this.passwordLength()).fill(0);
  }
}
