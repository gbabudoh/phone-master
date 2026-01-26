export interface IProduct {
  _id?: string;
  sellerId: string;
  sellerName?: string;
  sellerType?: string;
  category: 'handset' | 'accessory' | 'service_voucher';
  title: string;
  description: string;
  price: number; // in pence/cents
  stock: number;
  images: string[];
  status: 'active' | 'sold' | 'draft' | 'under_review';
  handsetDetails?: IHandsetDetails;
  accessoryDetails?: IAccessoryDetails;
  serviceDetails?: IServiceDetails;
  wholesaleDetails?: IWholesaleDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWholesaleDetails {
  minOrderQuantity: number;
  termsAndConditions?: string;
  discountTiers?: IDiscountTier[];
  shippingOptions?: IShippingOption[];
}

export interface IDiscountTier {
  minQuantity: number;
  discountPercent: number;
}

export interface IShippingOption {
  name: string;
  price: number; // in pence
  estimatedDays: string;
}

export interface IHandsetDetails {
  model: string; // e.g., 'iPhone 15 Pro', 'Galaxy S23'
  brand: string; // e.g., 'Apple', 'Samsung'
  IMEI: string; // Mandatory for used/refurbished phones
  condition: 'new' | 'refurbished' | 'used';
  grade: 'A' | 'B' | 'C'; // Visual/Functional grading
  networkStatus: 'unlocked' | 'locked';
  storage: string; // e.g., '128GB', '256GB'
  color: string;
  networkLock?: string; // Which network it's locked to
}

export interface IAccessoryDetails {
  type: 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other';
  compatibility: string[]; // Models this accessory fits
  oem: 'original' | 'aftermarket';
  brand?: string;
}

export interface IServiceDetails {
  type: 'top_up' | 'unlocking' | 'repair_voucher';
  provider: string;
  validity?: string; // Expiry date
  network?: string; // For top-ups/unlocking
}

