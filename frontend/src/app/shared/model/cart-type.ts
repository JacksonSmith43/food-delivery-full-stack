import { MenuItemsType } from './restaurants-type.module';

export interface CartItemType {
  id: number;
  menuItem: MenuItemsType;
  quantity: number;
}

export interface CartType {
  id: number;
  sessionId: string;
  cartItems: CartItemType[];
}

export interface CartSummaryType {
  totalQuantity: number;
  totalCost: number;
  itemCount: number;
}
