import { MenuItemsType, RestaurantType } from './restaurants-type.module';

export interface OrderTypeItem {
  id: number;
  menuItem: MenuItemsType;
  quantity: number;
}

export interface OrderType {
  id: number;
  orderNumber: number;
  userEmail: string;
  restaurant: RestaurantType;
  orderItem: OrderType[];
  totalPrice: number;
  status: OrderStatusType;
  orderDate: Date;
  deliveryAddress: string;
}

export type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
