import { ɵresolveComponentResources as resolveComponentResources, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { OrdersComponent } from './orders.component';
import template from './orders.component.html?raw';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AuthService } from '../../../auth/service/auth.service';
import { AuthType } from '../../../auth/model/auth-user-type';
import { OrderService } from '../../../shared/services/order.service';

type OrderServiceMock = {
  getOrders: ReturnType<typeof vi.fn>;
};

type AuthServiceMock = {
  authUser: ReturnType<typeof signal<AuthType | undefined>>;
};

type LocaStorageServiceMock = {
  getUserCredentials: ReturnType<typeof vi.fn>;
};

describe('OrdersComponent', () => {
  let fixture: ComponentFixture<OrdersComponent>;
  let component: OrdersComponent;

  let orderService: OrderServiceMock;
  let authService: AuthServiceMock;
  let locaStorageService: LocaStorageServiceMock;

  const createOrderServiceMock = (): OrderServiceMock => ({
    getOrders: vi.fn(),
  });

  const createAuthServiceMock = (): AuthServiceMock => ({
    authUser: signal(undefined),
  });

  const createLocaStorageServiceMock = (): LocaStorageServiceMock => ({
    getUserCredentials: vi.fn(),
  });

  const createComponent = async () => {
    await resolveComponentResources((url) => {
      if (url.endsWith('orders.component.html')) {
        return Promise.resolve(template);
      }

      if (url.endsWith('orders.component.css')) {
        return Promise.resolve('');
      }

      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: orderService },
        { provide: AuthService, useValue: authService },
        { provide: LocalStorageService, useValue: locaStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.resetTestingModule();

    orderService = createOrderServiceMock();
    authService = createAuthServiceMock();
    locaStorageService = createLocaStorageServiceMock();
  });

  describe('ngOnInit', () => {
    it('should load orders when the correct credentials are inputed', async () => {
      locaStorageService.getUserCredentials.mockReturnValue({ email: 'admin@gmx.at', password: '1234567' });
      orderService.getOrders.mockReturnValue(
        of([
          {
            orderId: 1,
            totalAmount: 2,
            totalCost: 4,
            status: 'PLACED',
            createdAt: '2023-06-22',
            paymentMethod: '',
            paymentStatus: '',
            deliverySnapshot: {
              name: 'Tester',
              userId: 1,
              phoneNumber: '01234567',
              label: 'Home',
              streetName: 'Teststreet',
              postalCode: 20,
              city: 'Vienna',
              country: 'Austria',
            },
            quantity: 2,
            price: 4,
            menuItemNameSnapshot: 'Grilled Chicken',
          },
        ]),
      );

      await createComponent();

      expect(locaStorageService.getUserCredentials).toHaveBeenCalled();
      expect(authService.authUser()).toEqual({ email: 'admin@gmx.at', password: '1234567' });
      expect(orderService.getOrders).toHaveBeenCalledWith('admin@gmx.at');
      expect(component.orders()).toEqual([
        {
          orderId: 1,
          totalAmount: 2,
          totalCost: 4,
          status: 'PLACED',
          createdAt: '2023-06-22',
          paymentMethod: '',
          paymentStatus: '',
          deliverySnapshot: {
            name: 'Tester',
            userId: 1,
            phoneNumber: '01234567',
            label: 'Home',
            streetName: 'Teststreet',
            postalCode: 20,
            city: 'Vienna',
            country: 'Austria',
          },
          quantity: 2,
          price: 4,
          menuItemNameSnapshot: 'Grilled Chicken',
        },
      ]);
    });

    it('should return an empty order signal when credentials are not inputed', async () => {
      locaStorageService.getUserCredentials.mockReturnValue(null);

      await createComponent();

      expect(orderService.getOrders).not.toHaveBeenCalled();
      expect(component.orders()).toEqual([]);
    });

    it('should have valid credentials and fail order response', async () => {
      locaStorageService.getUserCredentials.mockReturnValue({ email: 'admin@gmx.at', password: '01234567' });
      orderService.getOrders.mockReturnValue(
        throwError(() => ({
          error: 'Error',
        })),
      );

      await createComponent();

      expect(authService.authUser()).toEqual({ email: 'admin@gmx.at', password: '01234567' });
      expect(orderService.getOrders).toHaveBeenCalledWith('admin@gmx.at');
      expect(component.orders()).toEqual([]);
    });
  });
});
