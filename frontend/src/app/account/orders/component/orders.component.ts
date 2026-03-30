import { Component, inject, OnInit, signal } from '@angular/core';

import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../auth/service/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { OrderType } from '../../../shared/model/order-type';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  locaStorageService = inject(LocalStorageService);

  orders = signal<OrderType[]>([]);

  ngOnInit(): void {
    console.log('OrdersComponent_ngOnInit().');

    const userCredentials = this.locaStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);
    } else {
      this.orders.set([]);
      return;
    }

    console.log('OrdersComponent_ngOnInit()_userCredentials: ', userCredentials);

    this.orderService.getOrders(userCredentials.email!).subscribe({
      next: (orders: OrderType[]) => {
        console.log('OrdersComponent_ngOnInit()_orders: ', orders);
        this.orders.set(orders);
        console.log('OrdersComponent_ngOnInit()_this.orders(): ', this.orders());
      },
      error: (error) => {
        console.error('OrdersComponent_ngOnInit()_Error: ', error?.error?.message ?? error);
      },
    });
  }
}
