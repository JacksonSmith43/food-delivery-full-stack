import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  selectedFormField = signal<'email' | 'password' | undefined>(undefined);
}
