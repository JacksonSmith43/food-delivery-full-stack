import { AddressType } from './address-type';
import { CartSummaryType } from './cart-type';

export interface CheckoutType {
  id: number;
  address: AddressType;
  phoneNumber: number; 
  cartSummary: CartSummaryType;
}
