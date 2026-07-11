import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthType } from '../model/auth-user-type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  authUser = signal<AuthType | undefined>(undefined);
  isRegistrationSuccessful = signal<boolean>(false);
  isLoginSuccessful = signal<boolean>(false);

  registerUser(email: string, password: string) {
    console.log('registerUser().');
    return this.http.post(`${this.apiBaseUrl}/api/auth/registration/${email}`, password, { responseType: 'text' });
  }

  loginUser(credentials: { email: string; password: string }) {
    console.log('AuthService_loginUser().');

    return this.http.post<AuthType>(`${this.apiBaseUrl}/api/auth/login`, credentials).pipe(
      tap((user) => {
        this.authUser.set({ email: user.email, password: credentials.password });
      }),
    );
  }

  getCurrentUser(): Observable<AuthType | undefined> {
    console.log('AuthService_getCurrentUser().');

    return this.http.get<AuthType>(`${this.apiBaseUrl}/api/auth/me`).pipe(
      tap((user) => {
        this.authUser.set({ email: user.email, password: '' });
      }),
      catchError(() => {
        this.authUser.set(undefined);
        return of(undefined);
      }),
    );
  }

  logoutUser(): Observable<void> {
    console.log('AuthService_logoutUser().');

    return this.http.post<void>(`${this.apiBaseUrl}/api/auth/logout`, {}).pipe(
      tap(() => {
        this.authUser.set(undefined);
      }),
    );
  }
}
