import Stripe from 'stripe';
import { UserRole } from '@/types/user';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Commission rates based on seller type
export const COMMISSION_RATES = {
  buyer: 0,
  personal_seller: 0.08, // 8%
  retail_seller: 0.03, // 3%
  wholesale_seller: 0, // 0%
} as const;

// Listing fees
export const LISTING_FEES = {
  personal_seller: 80, // £0.80 in pence
  retail_seller: 0,
  wholesale_seller: 0,
} as const;

// Subscription prices (monthly, in pence)
export const SUBSCRIPTION_PRICES = {
  retail_seller: 1200, // £12.00
  wholesale_seller: 2900, // £29.00
} as const;

/**
 * Calculate commission fee based on seller role and sale amount
 */
export function calculateCommission(role: UserRole, amount: number): number {
  const rate = COMMISSION_RATES[role] || 0;
  return Math.round(amount * rate);
}

/**
 * Calculate net payout to seller after commission
 */
export function calculateNetPayout(role: UserRole, totalAmount: number): number {
  const commission = calculateCommission(role, totalAmount);
  return totalAmount - commission;
}

/**
 * Create a Stripe Payment Intent for escrow
 */
export async function createEscrowPaymentIntent(
  amount: number,
  currency: string = 'gbp',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: metadata || {},
    capture_method: 'manual', // Hold funds until release
  });
}

/**
 * Create a Stripe Connect account for sellers
 */
export async function createConnectAccount(
  email: string,
  type: 'express' | 'standard' = 'express'
): Promise<Stripe.Account> {
  return await stripe.accounts.create({
    type,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

/**
 * Create a subscription for retail/wholesale sellers
 */
export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
}

