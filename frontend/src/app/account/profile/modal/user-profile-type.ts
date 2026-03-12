import { AddressType } from '../../../shared/model/address-type';

export interface UserProfileType {
  email: string;
  phoneNumber: string;
  address: AddressType[];
  defaultAddressId: number;
}
