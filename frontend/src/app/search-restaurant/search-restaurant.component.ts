import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { RestaurantsService } from '../shared/services/restaurants.service';
import { NavBarService } from '../navbar/service/navbar.service';

@Component({
  selector: 'app-search-restaurant',
  imports: [FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './search-restaurant.component.html',
  styleUrl: './search-restaurant.component.css',
})
export class SearchRestaurant {
  restaurantsService = inject(RestaurantsService);
  navbarService = inject(NavBarService);

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
    this.restaurantsService.plz.set(this.form.value.plz || 'Undefined plz');
    this.form.controls.plz.reset();

    this.showRestaurantsWithCorrespondingEnteredPostcodes();
  }

  showRestaurantsWithCorrespondingEnteredPostcodes() {
    console.log('showRestaurantsWithCorrespondingEnteredPostcodes().');

    let enteredPlz = this.restaurantsService.plz();
    console.log('showRestaurantsWithCorrespondingEnteredPostcodes()_enteredPlz: ', enteredPlz);

    this.restaurantsService.getAllRestaurants().subscribe((restaurants) => {
      console.log('showRestaurantsWithCorrespondingEnteredPostcodes()_restaurants: ', restaurants);

      let restaurantsWithinPlz = restaurants.filter((r) => r.plz === enteredPlz);
      console.log(
        'showRestaurantsWithCorrespondingEnteredPostcodes()_restaurantsWithinPlz: ',
        restaurantsWithinPlz,
      );

      this.restaurantsService.restaurants.set(restaurantsWithinPlz);
    });
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
