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

    this.accountService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.accountService.currentUserProfile.set(user);
      },
      error: (error) => {
        console.error('AccountComponent_ngOnInit()_Error loading profile: ', error.error.message);
      },
    });
  }

  getPasswordLength() {
    // console.log('getPasswordLength().');
    return Array(this.passwordLength()).fill(0);
  }
}
