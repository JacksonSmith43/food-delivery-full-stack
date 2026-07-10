import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-account',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    console.log('AccountComponent_ngOnInit().');
    this.authService.getCurrentUser().subscribe();
  }
}
