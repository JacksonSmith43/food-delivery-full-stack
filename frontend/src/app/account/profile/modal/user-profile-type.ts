import { AddressType } from '../../../shared/model/address-type';

export interface UserProfileType {
  email: string;
  phoneNumber: number;
  address: AddressType[];
  defaultAddressId: number;
}
