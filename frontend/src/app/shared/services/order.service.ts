import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderService {
  http = inject(HttpClient);

  getOrders(email: string) {
    console.log('OrderService_getOrders().');
    return this.http.get(`/api/orders/${email}`, { responseType: 'text' });
  }
}
