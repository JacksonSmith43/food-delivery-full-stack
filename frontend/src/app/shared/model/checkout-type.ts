import { AddressType } from './address-type';
import { CartSummaryType } from './cart-type';

export interface CheckoutType {
  id: number;
  address: AddressType; // TODO: Add.
  phoneNumber: number; // TODO: Add.
  cartSummary: CartSummaryType;
}
