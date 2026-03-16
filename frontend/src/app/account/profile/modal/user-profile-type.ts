import { AddressType } from '../../../shared/model/address-type';

export interface UserProfileType {
  id: number;
  email: string;
  phoneNumber: string;
  address: AddressType[];
  defaultAddressId: number;
}
