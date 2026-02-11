import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../auth/service/auth.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
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
