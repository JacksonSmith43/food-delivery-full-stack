import { signal, ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CartSummaryType, CartType } from '../../shared/model/cart-type';
import template from './cart.component.html?raw';
import { CartService } from '../../shared/services/cart.service';

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

describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;

  let cartService: CartServiceMock;

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

  const createComponent = async () => {
    await resolveComponentResources((url) => {
      if (url.endsWith('cart.component.html')) {
        return Promise.resolve(template);
      }

      if (url.endsWith('cart.component.css')) {
        return Promise.resolve('');
      }

      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [{ provide: CartService, useValue: cartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.resetTestingModule();

    cartService = createCartServiceMock();
  });
});
