import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../auth/service/auth.service';
import { OrderStatusType, OrderType } from '../../../shared/model/order-type';

@Component({
  selector: 'app-orders',
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);

  orders = signal<OrderType[]>([]);

  ngOnInit(): void {
    console.log('OrdersComponent_ngOnInit().');

    this.orderService.getOrders().subscribe({
      next: (orders: OrderType[]) => {
        console.log('OrdersComponent_ngOnInit()_orders: ', orders);
        this.orders.set(orders);
      },
      error: (error) => {
        console.error('OrdersComponent_ngOnInit()_Error: ', error?.error?.message ?? error);
      },
    });
  }

  formatAddress(a: {
    label: string;
    streetName: string;
    postalCode: string | number;
    city: string;
    country: string;
  }): string {
    return `${a.label}, ${a.streetName}, ${a.postalCode} ${a.city}, ${a.country}`;
  }

  getStatusClass(status: OrderStatusType): string {
    const normalised = status?.toString().toLowerCase() ?? 'unknown';
    return `status-${normalised}`;
  }

  formatStatus(status: string): string {
    if (!status) {
      return 'Unknown';
    }

    const normalised = status.toLowerCase();
    return normalised.charAt(0).toUpperCase() + normalised.slice(1);
  }
}
