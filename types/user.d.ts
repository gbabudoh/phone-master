export type UserRole = 'admin' | 'buyer' | 'personal_seller' | 'retail_seller' | 'wholesale_seller';
export type UserStatus = 'active' | 'pending_verification' | 'suspended';
export type SellerPlan = 'wholesale_sub' | 'retail_sub' | 'free';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  profile: IUserProfile;
  sellerDetails?: ISellerDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  address?: IAddress;
}

export interface IAddress {
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface ISellerDetails {
  plan: SellerPlan;
  stripeAccountId?: string; // For Stripe Connect
  companyName?: string; // For Retail/Wholesale
  vatNumber?: string; // For Wholesale
  businessAddress?: IAddress;
  activeListings?: number; // For Personal sellers (max 5)
}

