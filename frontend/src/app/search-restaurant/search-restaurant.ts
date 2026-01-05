import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-restaurant',
  imports: [FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './search-restaurant.html',
  styleUrl: './search-restaurant.css',
})
export class SearchRestaurant {
  form = new FormGroup({
    plz: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(23),
    ]),
  });

  onSubmit() {
    console.log('SearchRestaurant_onSubmit().');

    if (this.form.controls.plz.invalid) {
      console.log('SearchRestaurant_onSubmit()_invalid.');
      this.form.controls.plz.reset();
      return;
    }

    this.form.controls.plz.reset();
  }

  get plzErrorMessages() {
    if (this.form.controls.plz.hasError('required')) {
      return 'Input required that is a number between 1 and 23.';
    } else if (this.form.controls.plz.hasError('min')) {
      return 'The PLZ number is not allowed to be shorter than 1.';
    } else if (this.form.controls.plz.hasError('max')) {
      return 'The PLZ number is not allowed to be longer (including) than 23.';
    } else {
      return 'Some other issue.';
    }
  }
}
