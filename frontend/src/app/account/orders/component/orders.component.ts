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

    let userCredentials = this.locaStorageService.getUserCredentials();

    if (userCredentials) {
      this.authService.authUser.set(userCredentials);
    }

    console.log('OrdersComponent_ngOnInit()_userCredentials: ', userCredentials);

    this.orderService.getOrders(userCredentials.email!).subscribe({
      next: (order) => {
        console.log('OrdersComponent_ngOnInit()_order: ', order);

        const parsed = JSON.parse(order) as OrderType[] | OrderType; // This converts the JSON string into a JavaScript object. It can be either an array of OrderType or a single OrderType.

        this.orders.set(Array.isArray(parsed) ? parsed : [parsed]); // This makes sure that this.orders is always an array, even if the API returns a single order. If parsed is already an array, it sets it directly. If it's a single object, it wraps it in an array.
        console.log('OrdersComponent_ngOnInit()_this.orders(): ', this.orders());
      },
      error: (error) => {
        console.error('OrdersComponent_ngOnInit()_Error: ', error.error.message);
      },
    });
  }
}
