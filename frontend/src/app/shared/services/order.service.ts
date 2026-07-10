import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { OrderType } from '../model/order-type';

@Injectable({ providedIn: 'root' })
export class OrderService {
  http = inject(HttpClient);

  getOrders() {
    console.log('OrderService_getOrders().');
    return this.http.get<OrderType[]>(`/api/orders`);
  }
}
