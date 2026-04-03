export interface OrderType {
  orderId: number;
  totalAmount: number;
  totalCost: number;
  status: OrderStatusType;
  createdAt: string;
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
  orderItems: OrderItemType[];
}

export interface OrderItemType {
  quantity: number;
  price: number;
  menuItemNameSnapshot: string;
}

export enum OrderStatusType {
  'PLACED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
}
