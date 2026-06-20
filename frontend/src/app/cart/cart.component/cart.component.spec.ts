import { signal, ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CartComponent } from './cart.component';
import { CartSummaryType, CartType } from '../../shared/model/cart-type';
import template from './cart.component.html?raw';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../auth/service/auth.service';
import { AuthType } from '../../auth/model/auth-user-type';
import { UserProfileType } from '../../account/profile/modal/user-profile-type';
import { AccountService } from '../../account/service/account.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

type CartServiceMock = {
  cart: ReturnType<typeof signal<CartType | null>>;
  cartSummary: ReturnType<typeof signal<CartSummaryType>>;
  errorMessage: ReturnType<typeof signal<string>>;
  successMessage: ReturnType<typeof signal<string>>;
  isSuccessful: ReturnType<typeof signal<boolean>>;
  // checkoutCartComputed

  getCart: ReturnType<typeof vi.fn>;
  addItemToCart: ReturnType<typeof vi.fn>;
  removeItemFromCart: ReturnType<typeof vi.fn>;
  getCartSummary: ReturnType<typeof vi.fn>;
  refreshCart: ReturnType<typeof vi.fn>;
  getItemQuantity: ReturnType<typeof vi.fn>;
  checkoutCart: ReturnType<typeof vi.fn>;
};

type AuthServiceMock = {
  successMessage: ReturnType<typeof signal<string>>;
  errorMessage: ReturnType<typeof signal<string>>;
  authUser: ReturnType<typeof signal<AuthType | undefined>>;
  isValid: ReturnType<typeof signal<boolean>>;

  registerUser: ReturnType<typeof vi.fn>;
  loginUser: ReturnType<typeof vi.fn>;
};

type AccountServiceMock = {
  selectedFormField: ReturnType<typeof signal<string>>;
  currentUserProfile: ReturnType<typeof signal<UserProfileType | null>>;

  changeEmailAddress: ReturnType<typeof vi.fn>;
  changePassword: ReturnType<typeof vi.fn>;
  getUserProfile: ReturnType<typeof vi.fn>;
  changePhoneNumber: ReturnType<typeof vi.fn>;
  openDialog: ReturnType<typeof vi.fn>;
};

type LocalStorageServiceMock = {
  getRestaurants: ReturnType<typeof vi.fn>;
  getCurrentRestaurant: ReturnType<typeof vi.fn>;
  getMenuItems: ReturnType<typeof vi.fn>;
  saveToLocalStorage: ReturnType<typeof vi.fn>;
  getUserCredentials: ReturnType<typeof vi.fn>;
};

describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;

  let cartService: CartServiceMock;
  let authService: AuthServiceMock;
  let accountService: AccountServiceMock;
  let localStorageService: LocalStorageServiceMock;

  const createCartServiceMock = (): CartServiceMock => ({
    cart: signal<CartType | null>(null),
    cartSummary: signal<CartSummaryType>({ totalQuantity: 0, totalCost: 0, itemCount: 0 }),
    errorMessage: signal(''),
    successMessage: signal(''),
    isSuccessful: signal(false),

    getCart: vi.fn(),
    addItemToCart: vi.fn(),
    removeItemFromCart: vi.fn(),
    getCartSummary: vi.fn(),
    refreshCart: vi.fn(),
    getItemQuantity: vi.fn(),
    checkoutCart: vi.fn(),
  });

  const createAuthServiceMock = (): AuthServiceMock => ({
    successMessage: signal(''),
    errorMessage: signal(''),
    authUser: signal<AuthType | undefined>({ email: '', password: '' }),
    isValid: signal(false),

    registerUser: vi.fn(),
    loginUser: vi.fn(),
  });

  const createAccountServiceMock = (): AccountServiceMock => ({
    selectedFormField: signal(''),
    currentUserProfile: signal({ id: 0, email: '', phoneNumber: '', address: [], defaultAddressId: 0 }),

    changeEmailAddress: vi.fn(),
    changePassword: vi.fn(),
    getUserProfile: vi.fn(),
    changePhoneNumber: vi.fn(),
    openDialog: vi.fn(),
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
      if (url.endsWith('cart.component.html')) {
        return Promise.resolve(template);
      }

      if (
        url.endsWith('cart.component.css') ||
        url.endsWith('profile-modal.component.html') ||
        url.endsWith('profile-modal.component.css') ||
        url.endsWith('profile.component.html') ||
        url.endsWith('profile.component.css')
      ) {
        return Promise.resolve('');
      }

      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartService },
        { provide: AuthService, useValue: authService },
        { provide: AccountService, useValue: accountService },
        { provide: LocalStorageService, useValue: localStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.resetTestingModule();

    cartService = createCartServiceMock();
    authService = createAuthServiceMock();
    accountService = createAccountServiceMock();
    localStorageService = createLocalStorageServiceMock();
  });

  it('should refresh the cart and load the user profile on init when user credentials exist', async () => {
    localStorageService.getUserCredentials.mockReturnValue({
      email: 'test@gmx.at',
      password: 'secret',
    });

    accountService.getUserProfile.mockReturnValue(
      of(
        JSON.stringify({
          id: 1,
          email: 'test@gmx.at',
          phoneNumber: '01234567',
          address: [
            {
              id: 1,
              label: 'Home',
              streetName: 'Teststreet 20',
              postalCode: 20,
              city: 'Vienna',
              country: 'Austria',
            },
          ],
          defaultAddressId: 1,
        }),
      ),
    );

    await createComponent();

    expect(cartService.refreshCart).toHaveBeenCalled();
    expect(authService.authUser()).toEqual({
      email: 'test@gmx.at',
      password: 'secret',
    });
    expect(accountService.getUserProfile).toHaveBeenCalledWith('test@gmx.at');
    expect(accountService.currentUserProfile()).toEqual({
      id: 1,
      email: 'test@gmx.at',
      phoneNumber: '01234567',
      address: [
        {
          id: 1,
          label: 'Home',
          streetName: 'Teststreet 20',
          postalCode: 20,
          city: 'Vienna',
          country: 'Austria',
        },
      ],
      defaultAddressId: 1,
    });
  });

  it('should only refresh the cart on init when no user credentials exist', async () => {
    localStorageService.getUserCredentials.mockReturnValue(undefined);

    await createComponent();

    expect(cartService.refreshCart).toHaveBeenCalled();
    expect(accountService.getUserProfile).not.toHaveBeenCalled();
  });

  it('should add an item to the cart then refresh the cart', async () => {
    cartService.addItemToCart.mockReturnValue(of({ menuItemId: 1, quantity: 1 }));

    await createComponent();
    component.onAddToCart(1);

    expect(cartService.addItemToCart).toHaveBeenCalledWith(1, 1);
    expect(cartService.refreshCart).toHaveBeenCalled();
  });

  it('should remove an item from the cart then refresh it', async () => {
    cartService.removeItemFromCart.mockReturnValue(of(2, 1));

    await createComponent();
    component.onRemoveFromCart(2);

    expect(cartService.removeItemFromCart).toHaveBeenCalledWith(2, 1);
    expect(cartService.refreshCart).toHaveBeenCalled();
  });

  it('should checkout cart and set items/states to their signals after a timeout', async () => {
    // Replace real timers so the test can control when the delayed reset runs.
    // vi.useFakeTimers() is not saying that a timer will necessarily be used. It replaces the real timer APIs (setTimeout, setInterval) with controllable test timers. From this point on, your test doesn't actually wait 2 seconds; instead, Vitest just notes: "a timer was scheduled here".
    vi.useFakeTimers();

    // Seed the cart state first so the timeout has meaningful data to clear.
    cartService.cart.set({
      id: 1,
      sessionId: 'session-1',
      cartItems: [{ id: 1, menuItem: 1, quantity: 1 } as any],
    });

    // Seed the summary state for the same reason.
    cartService.cartSummary.set({ totalQuantity: 1, totalCost: 3, itemCount: 1 });

    cartService.checkoutCart.mockReturnValue(of({ ok: true }));

    await createComponent();

    component.onCheckout();

    // These values are updated immediately in the success branch.
    expect(component.successMessage()).toBe('Checkout successful.');
    expect(component.isSuccessful()).toBe(true);

    // Fast-forward virtual time so the callback inside setTimeout(2000) runs now.
    // vi.advanceTimersByTime(2000) is saying: "advance the virtual clock by 2000 milliseconds, and execute any timers that are due in that time". So if there was a setTimeout(..., 2000) scheduled, it will run immediately when this line executes, without actually waiting 2 seconds in real time.
    vi.advanceTimersByTime(2000);

    // These assertions belong after the timer because the reset is delayed.
    expect(component.successMessage()).toBe('');
    expect(component.isSuccessful()).toBe(false);
    expect(component.cart()).toEqual({ id: 0, sessionId: '', cartItems: [] });
    expect(component.cartSummary()).toEqual({ totalQuantity: 0, totalCost: 0, itemCount: 0 });

    // Restore normal timer behaviour for the tests that run after this one.
    // vi.useRealTimers() does not stop the timer in the strict sense, but rather switches back to normal runtime behaviour after the test, so that later tests do not continue to run with fake timers.
    vi.useRealTimers();
  });
});
