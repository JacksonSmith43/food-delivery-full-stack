import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { OrderType } from '../model/order-type';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getOrders() {
    console.log('OrderService_getOrders().');
    return this.http.get<OrderType[]>(`${this.apiBaseUrl}/api/orders`);
  }
}
