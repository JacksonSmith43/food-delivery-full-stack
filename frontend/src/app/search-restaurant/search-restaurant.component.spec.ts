import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { of } from 'rxjs';

import { SearchRestaurant } from './search-restaurant.component';
import { CategoryType, MenuItemsType, RestaurantType } from '../shared/model/restaurants-type.module';
import template from './search-restaurant.component.html?raw';
import { RestaurantsService } from '../shared/services/restaurants.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NavBarService } from '../navbar/service/navbar.service';
import { Router } from '@angular/router';

type RestaurantServiceMock = {
  allRestaurants: ReturnType<typeof signal<RestaurantType[]>>;
  filteredRestaurants: ReturnType<typeof signal<RestaurantType[]>>;
  filteredDietaryLabelByRestaurants: ReturnType<typeof signal<Map<string, number>>>;
  plz: ReturnType<typeof signal<string>>;
  categories: ReturnType<typeof signal<CategoryType[]>>;
  menuItems: ReturnType<typeof signal<MenuItemsType[]>>;
  filteredMenuItems: ReturnType<typeof signal<MenuItemsType[]>>;
  filteredDietaryLabelByMenuItem: ReturnType<typeof signal<Map<string, number>>>;

  getAllRestaurants: ReturnType<typeof vi.fn>;
  getUniqueCategories: ReturnType<typeof vi.fn>;
  filterByCategory: ReturnType<typeof vi.fn>;
  filterByRestaurantMenuItems: ReturnType<typeof vi.fn>;
  filterDietaryLabelByRestaurants: ReturnType<typeof vi.fn>;
  countDietaryLabelsForRestaurants: ReturnType<typeof vi.fn>;
  filterDietaryLabelByMenuItem: ReturnType<typeof vi.fn>;
  countDietaryLabelsForMenuItems: ReturnType<typeof vi.fn>;
};

type LocalStorageServiceMock = {
  getRestaurants: ReturnType<typeof vi.fn>;
  getCurrentRestaurant: ReturnType<typeof vi.fn>;
  getMenuItems: ReturnType<typeof vi.fn>;
  saveToLocalStorage: ReturnType<typeof vi.fn>;
  getUserCredentials: ReturnType<typeof vi.fn>;
};

type RouterMock = {
  navigate: ReturnType<typeof vi.fn>;
};

describe('SearchRestaurantComponent', () => {
  let fixture: ComponentFixture<SearchRestaurant>;
  let component: SearchRestaurant;

  let restaurantService: RestaurantServiceMock;
  let localStorageService: LocalStorageServiceMock;
  let router: RouterMock;

  const createRestaurantServiceMock = (): RestaurantServiceMock => ({
    allRestaurants: signal([]),
    filteredRestaurants: signal([]),
    filteredDietaryLabelByRestaurants: signal(new Map([[' ', 0]])),
    plz: signal(''),
    categories: signal([]),
    menuItems: signal([]),
    filteredMenuItems: signal([]),
    filteredDietaryLabelByMenuItem: signal(new Map([[' ', 0]])),

    getAllRestaurants: vi.fn(),
    getUniqueCategories: vi.fn(),
    filterByCategory: vi.fn(),
    filterByRestaurantMenuItems: vi.fn(),
    filterDietaryLabelByRestaurants: vi.fn(),
    countDietaryLabelsForRestaurants: vi.fn(),
    filterDietaryLabelByMenuItem: vi.fn(),
    countDietaryLabelsForMenuItems: vi.fn(),
  });

  const createLocalStorageServiceMock = (): LocalStorageServiceMock => ({
    getRestaurants: vi.fn(),
    getCurrentRestaurant: vi.fn(),
    getMenuItems: vi.fn(),
    saveToLocalStorage: vi.fn(),
    getUserCredentials: vi.fn(),
  });

  const createRouterMock = (): RouterMock => ({
    navigate: vi.fn(),
  });

  const createComponent = async () => {
    await resolveComponentResources((url) => {
      if (url.endsWith('search-restaurant.component.html')) {
        return Promise.resolve(template);
      }
      if (url.endsWith('search-restaurant.component.css')) {
        return Promise.resolve('');
      }

      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [SearchRestaurant],
      providers: [
        { provide: RestaurantsService, useValue: restaurantService },
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: Router, useValue: router },
        { provide: NavBarService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchRestaurant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    restaurantService = createRestaurantServiceMock();
    localStorageService = createLocalStorageServiceMock();
    router = createRouterMock();
  });

  it('should not submit when the form is invalid', async () => {
    await createComponent();

    expect(component.form.controls.plz.invalid).toBe(true);
    component.onSubmit();
    expect(component.successfullSubmission()).toBe(false);
    expect(component.form.controls.plz.value).toBe('');
  });

  it('should search restaurants for a valid plz', async () => {
    restaurantService.getAllRestaurants.mockReturnValue(
      of([{ plz: '10' } as RestaurantType, { plz: '20' } as RestaurantType]),
    );

    await createComponent();
    const showRestaurantSpy = vi.spyOn(component, 'showRestaurantsWithCorrespondingEnteredPostcodes');

    component.form.controls.plz.setValue('20');

    expect(component.form.controls.plz.valid).toBe(true);
    component.onSubmit();

    expect(component.successfullSubmission()).toBe(true);
    expect(restaurantService.plz()).toBe('20');
    expect(showRestaurantSpy).toHaveBeenCalled();

    expect(restaurantService.getAllRestaurants).toHaveBeenCalled();
    expect(component.plzExists()).toBe(true);
    expect(component.form.controls.plz.value).toBe('');

    expect(localStorageService.saveToLocalStorage).toHaveBeenCalledWith('restaurants', [
      { plz: '20' } as RestaurantType,
    ]);
    expect(router.navigate).toHaveBeenCalledWith(['/restaurants/20']);
  });

  it('should set plzExists to false when no restaurant matches the entered plz', async () => {
    restaurantService.getAllRestaurants.mockReturnValue(of([{ plz: '10' } as RestaurantType]));

    await createComponent();
    const showRestaurantSpy = vi.spyOn(component, 'showRestaurantsWithCorrespondingEnteredPostcodes');

    component.form.controls.plz.setValue('20');
    expect(component.form.controls.plz.valid).toBe(true);

    component.onSubmit();

    expect(component.successfullSubmission()).toBe(true);
    expect(restaurantService.plz()).toBe('20');
    expect(showRestaurantSpy).toHaveBeenCalled();

    expect(restaurantService.getAllRestaurants).toHaveBeenCalled();
    expect(component.plzExists()).toBe(false);
  });
});
