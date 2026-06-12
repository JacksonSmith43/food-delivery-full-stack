import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, ɵresolveComponentResources as resolveComponentResources } from '@angular/core';

import { SearchRestaurant } from './search-restaurant.component';
import { CategoryType, MenuItemsType, RestaurantType } from '../shared/model/restaurants-type.module';
import template from './search-restaurant.component.html?raw';
import { RestaurantsService } from '../shared/services/restaurants.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

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

describe('SearchRestaurantComponent', () => {
  let fixture: ComponentFixture<SearchRestaurant>;
  let component: SearchRestaurant;

  let restaurantService: RestaurantServiceMock;
  let localStorageService: LocalStorageServiceMock;

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
  });

  it('should not return a valid plz form and should reset it', async () => {
    await createComponent();

    expect(component.form.controls.plz.invalid).toBe(true);
    component.onSubmit();
    expect(component.successfullSubmission()).toBe(false);
    expect(component.form.controls.plz.value).toBe('');
  });
});
