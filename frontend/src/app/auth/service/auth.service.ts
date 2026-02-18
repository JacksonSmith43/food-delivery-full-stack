import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { UserType } from '../model/user-type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  currentUser = signal<UserType | undefined>(undefined);

  registerUser(email: string, password: string) {
    console.log('registerUser().');
    return this.http.post(`/api/auth/registration/${email}`, password, { responseType: 'text' });
  }

  loginUser(email: string, password: string) {
    console.log('AuthService_loginUser().');
    this.currentUser.set({ email, password });
    sessionStorage.setItem('userCredentials', JSON.stringify(this.currentUser()));

    return this.http.post(`/api/auth/login/${email}`, password, { responseType: 'text' });
  }
}
