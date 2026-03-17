import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { AuthService } from '../../service/auth.service';
import { AuthType } from '../../model/auth-user-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
  });

  ngOnInit(): void {
    console.log('LoginComponent_ngOnInit().');
    this.authService.errorMessage.set('');
  }

  onSubmit(emailInput: string, passwordInput: string) {
    console.log('onSubmit().');
    console.log('onSubmit()_email: ', emailInput);
    console.log('onSubmit()_passwordInput: ', passwordInput);

    if (this.loginForm.invalid) {
      console.log('onSubmit()_Invalid submit.');
      return;
    }

    this.onLogin(this.loginForm.value as AuthType);

    this.loginForm.reset();
  }

  onLogin(registerForm: AuthType) {
    console.log('onRegister().');

    this.authService.loginUser(registerForm.email, registerForm.password).subscribe({
      next: (user) => {
        console.log('onLogin()_next_user: ', user);
        this.router.navigateByUrl('account');
      },
      error: (e) => {
        console.error('onLogin()_error: ', e);
        this.authService.authUser.set(undefined);
        this.authService.errorMessage.set(JSON.parse(e.error).code);
      },
    });
  }

  get emailIsInvalid() {
    console.log('emailIsInvalid().');

    if (this.loginForm.controls.email.hasError('required')) {
      return 'An email input is required.';
    } else if (this.loginForm.controls.email.hasError('email')) {
      return 'Invalid email address.';
    }

    return '';
  }

  get passwordIsInvalid() {
    console.log('passwordIsInvalid().');

    if (this.loginForm.controls.password.hasError('required')) {
      return 'A password input is required.';
    } else if (this.loginForm.controls.password.hasError('minlength')) {
      return 'Too short. Minimum of 6 characters are required.';
    } else if (this.loginForm.controls.password.hasError('maxlength')) {
      return 'Too long. Maximum of 30 characters are allowed.';
    }
    return '';
  }
}
