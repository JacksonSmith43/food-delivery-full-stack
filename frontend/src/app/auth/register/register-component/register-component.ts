import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { AuthService } from '../../service/auth.service';
import { UserType } from '../../model/user-type';

@Component({
  selector: 'app-register',
  imports: [MatButton, ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  errorMessage = this.authService.errorMessage;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
  });

  onSubmit(emailInput: string, passwordInput: string) {
    console.log('onSubmit().');
    console.log('onSubmit()_email: ', emailInput);
    console.log('onSubmit()_passwordInput: ', passwordInput);

    if (this.registerForm.invalid) {
      console.log('onSubmit()_Invalid submit.');
      return;
    }

    this.onRegister(this.registerForm.value as UserType);

    this.registerForm.reset();
  }

  onRegister(registerForm: UserType) {
    console.log('onRegister().');

    this.authService.registerUser(registerForm.email, registerForm.password).subscribe({
      next: (user) => {
        console.log('onRegister()_next_user: ', user);
        this.errorMessage.set('');
      },
      error: (e) => {
        console.error('onRegister()_error: ', e);
        this.errorMessage.set(e.error);
      },
    });
  }

  get emailIsInvalid() {
    console.log('emailIsInvalid().');

    if (this.registerForm.controls.email.hasError('required')) {
      return 'An email input is required.';
    } else if (this.registerForm.controls.email.hasError('email')) {
      return 'Invalid email address.';
    }

    return '';
  }

  get passwordIsInvalid() {
    console.log('passwordIsInvalid().');

    if (this.registerForm.controls.password.hasError('required')) {
      return 'A password input is required.';
    } else if (this.registerForm.controls.password.hasError('minlength')) {
      return 'Too short. Minimum of 6 characters are required.';
    } else if (this.registerForm.controls.password.hasError('maxlength')) {
      return 'Too long. Maximum of 30 characters are allowed.';
    }
    return '';
  }
}
