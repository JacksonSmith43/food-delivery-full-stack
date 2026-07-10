import { ɵresolveComponentResources as resolveComponentResources, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { OrdersComponent } from './orders.component';
import template from './orders.component.html?raw';
import { AuthService } from '../../../auth/service/auth.service';
import { AuthType } from '../../../auth/model/auth-user-type';
import { OrderService } from '../../../shared/services/order.service';

type OrderServiceMock = {
  getOrders: ReturnType<typeof vi.fn>;
};

type AuthServiceMock = {
  authUser: ReturnType<typeof signal<AuthType | undefined>>;
};

describe('OrdersComponent', () => {
  let fixture: ComponentFixture<OrdersComponent>;
  let component: OrdersComponent;

  let orderService: OrderServiceMock;
  let authService: AuthServiceMock;

  const createOrderServiceMock = (): OrderServiceMock => ({
    getOrders: vi.fn().mockReturnValue(
      of({
        orderId: 0,
        totalAmount: 0,
        totalCost: 0,
        status: '',
        createdAt: '',
        paymentMethod: '',
        paymentStatus: '',
        deliverySnapshot: {
          name: '',
          userId: 1,
          phoneNumber: '',
          label: '',
          streetName: '',
          postalCode: 0,
          city: '',
          country: '',
        },
        quantity: 2,
        price: 4,
        menuItemNameSnapshot: '',
      }),
    ),
  });

  const createAuthServiceMock = (): AuthServiceMock => ({
    authUser: signal(undefined),
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
  });

  describe('ngOnInit', () => {
    it('should load orders when the correct credentials are inputed', async () => {
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

      expect(orderService.getOrders).toHaveBeenCalled();
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

    it('should have valid credentials and fail order response', async () => {
      orderService.getOrders.mockReturnValue(
        throwError(() => ({
          error: 'Error',
        })),
      );

      await createComponent();

      expect(orderService.getOrders).toHaveBeenCalled();
      expect(component.orders()).toEqual([]);
    });
  });
});
