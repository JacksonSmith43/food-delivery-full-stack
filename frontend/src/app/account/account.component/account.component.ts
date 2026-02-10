import { Component, inject } from '@angular/core';

import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-account.component',
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  authService = inject(AuthService);
}
