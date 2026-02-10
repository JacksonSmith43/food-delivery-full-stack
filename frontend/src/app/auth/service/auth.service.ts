import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  registerUser(email: string, password: string) {
    console.log('registerUser().');
    return this.http.post(`/api/auth/registration/${email}`, password, { responseType: 'text' });
  }

  loginUser(email: string, password: string) {
    console.log('AuthService_loginUser().');
    return this.http.post(`/api/auth/login/${email}`, password, { responseType: 'text' });
  }
}
