import { Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../auth/service/auth.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { AccountService } from '../../../service/account.service';

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
  currentUserProfile = this.accountService.currentUserProfile;

 
  passwordLength = computed(() => {
    let authUserPassword = this.authService.authUser()?.password;
    return authUserPassword ? authUserPassword.length : 0;
  });


  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);

      this.accountService.getUserProfile(userCredentials.email).subscribe({
        next: (user) => {
          console.log('AccountComponent_ngOnInit()_user: ', user);
          this.accountService.currentUserProfile.set(JSON.parse(user));
        },
        error: (error) => {
          console.error('ProfileComponent_ngOnInit()_Error loading profile: ', error.error.message);
        },
      });
    }
  }

  getPasswordLength() {
    // console.log('getPasswordLength().');
    return Array(this.passwordLength()).fill(0);
  }
}
