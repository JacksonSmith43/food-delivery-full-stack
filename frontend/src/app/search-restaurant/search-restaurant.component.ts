import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { RestaurantsService } from '../shared/services/restaurants.service';
import { NavBarService } from '../navbar/service/navbar.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-search-restaurant',
  imports: [FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './search-restaurant.component.html',
  styleUrl: './search-restaurant.component.css',
})
export class SearchRestaurant {
  restaurantsService = inject(RestaurantsService);
  navbarService = inject(NavBarService);
  locaStorageService = inject(LocalStorageService);
  router = inject(Router);

  plzExists = signal<boolean>(false);
  successfullSubmission = signal<boolean>(false);

  form = new FormGroup({
    plz: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(23)],
    }),
  });

  onSubmit() {
    console.log('SearchRestaurant_onSubmit().');

    if (this.form.controls.plz.invalid) {
      console.log('SearchRestaurant_onSubmit()_invalid.');
      this.successfullSubmission.set(false);
      this.form.controls.plz.reset();
      return;
    }

    this.successfullSubmission.set(true);
    this.restaurantsService.plz.set(this.form.value.plz || 'Undefined plz');

    this.showRestaurantsWithCorrespondingEnteredPostcodes();
  }

  showRestaurantsWithCorrespondingEnteredPostcodes() {
    console.log('showRestaurantsWithCorrespondingEnteredPostcodes().');

    let enteredPlz = this.restaurantsService.plz();
    console.log('showRestaurantsWithCorrespondingEnteredPostcodes()_enteredPlz: ', enteredPlz);

    this.restaurantsService.getAllRestaurants().subscribe((restaurants) => {
      console.log('showRestaurantsWithCorrespondingEnteredPostcodes()_restaurants: ', restaurants);

      let restaurantsWithinPlz = restaurants.filter((r) => r.plz === enteredPlz);
      console.log('showRestaurantsWithCorrespondingEnteredPostcodes()_restaurantsWithinPlz: ', restaurantsWithinPlz);

      // Checks if the PLZ exists after filtering the API results.
      if (restaurantsWithinPlz.length > 0) {
        this.plzExists.set(true);
        this.form.controls.plz.reset();
        
        this.locaStorageService.saveToLocalStorage('restaurants', restaurantsWithinPlz);
        this.restaurantsService.filteredRestaurants.set(restaurantsWithinPlz);
        this.router.navigate(['/restaurants/' + enteredPlz]);
      
      } else {
        this.plzExists.set(false);

        setTimeout(() => {
          this.form.controls.plz.reset();
          this.plzExists.set(true);
        }, 3000);
      }
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
