export type EscrowStatus = 'held' | 'released' | 'disputed';
export type PayoutStatus = 'pending' | 'paid' | 'failed';

export interface ITransaction {
  _id?: string;
  buyerId: string;
  sellerId: string;
  items: ITransactionItem[];
  totalAmount: number; // Total paid by buyer (in pence/cents)
  commissionFee: number; // Fee deducted (in pence/cents)
  netPayout: number; // Amount due to seller (in pence/cents)
  stripeChargeId: string;
  stripePaymentIntentId?: string;
  escrowStatus: EscrowStatus;
  payoutStatus: PayoutStatus;
  purchaseDate: Date;
  releaseDate?: Date; // When escrow was released
  createdAt?: Date;
}

export interface ITransactionItem {
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number; // Price at time of sale
  totalPrice: number;
}

