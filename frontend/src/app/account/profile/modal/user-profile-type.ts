import { AuthType } from '../../../auth/model/auth-user-type';
import { AddressType } from '../../../shared/model/address-type';

export interface UserProfileType {
  authUser: AuthType;
  phoneNumber: number;
  addresses: AddressType[];
  defaultAddressId: number;
}
