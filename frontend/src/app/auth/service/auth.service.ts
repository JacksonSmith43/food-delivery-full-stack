import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { AuthType } from '../model/auth-user-type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  authUser = signal<AuthType | undefined>(undefined);
  isValid = signal<boolean>(false);

  registerUser(email: string, password: string) {
    console.log('registerUser().');
    return this.http.post(`/api/auth/registration/${email}`, password, { responseType: 'text' });
  }

  loginUser(email: string, password: string) {
    console.log('AuthService_loginUser().');
    this.authUser.set({ email, password });
    sessionStorage.setItem('userCredentials', JSON.stringify(this.authUser()));

    return this.http.post(`/api/auth/login/${email}`, password, { responseType: 'text' });
  }
}
