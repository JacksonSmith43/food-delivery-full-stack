import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);

  selectedFormField = signal<'email' | 'password' | undefined>(undefined);

  changeEmailAddress(currentEmail: string, newEmail: string) {
    console.log('changeEmailAddress().');
    return this.http.post(`/api/auth/emailChange/${currentEmail}`, newEmail, {
      responseType: 'text',
    });
  }

  changePassword(currentPassword: string, newPassword: string, email: string) {
    console.log('changePassword().');

    const body = {
      email,
      currentPassword,
      newPassword,
    };

    return this.http.post<string>(`/api/auth/passwordChange/`, body, {
      responseType: 'text' as 'json',});
  }
}
