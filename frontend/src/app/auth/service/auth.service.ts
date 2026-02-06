import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { UserType } from '../model/user-type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  registerUser(registerForm: UserType) {
    console.log('registerUser().');

    return this.http.post<UserType>('/api/registration', registerForm);
  }
}
