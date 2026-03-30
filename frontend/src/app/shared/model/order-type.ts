export interface OrderType {
  totalAmount: number;
  totalCost: number;
  status: string;
  createdAt: Date;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  deliverySnapshot: {
    name: string;
    userId: number;
    phoneNumber: string;
    label: string;
    streetName: string;
    postalCode: number;
    city: string;
    country: string;
  };
  orderItem: OrderItemType;
}

export interface OrderItemType {
  quantity: number;
  price: number;
  menuItemNameSnapshot: string;
}

export type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
