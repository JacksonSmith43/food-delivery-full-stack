import { Component, inject } from '@angular/core';

import { AuthService } from '../../../auth/service/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  locaStorage = inject(LocalStorageService);

  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');

    let userCredentials = this.locaStorage.getUserCredentials();

    if (userCredentials) {
      this.authService.currentUser.set(userCredentials);
    }
  }
}
