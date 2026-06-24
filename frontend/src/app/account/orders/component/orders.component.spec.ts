import { ɵresolveComponentResources as resolveComponentResources, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
