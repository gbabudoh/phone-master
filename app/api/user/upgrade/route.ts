import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { jwtVerify } from 'jose';
import { UserRole, SellerPlan } from '@prisma/client';
import { stripe, SUBSCRIPTION_PRICES } from '@/lib/payment';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { role, storeName } = await request.json();

    // Validate inputs
    const validRoles = ['personal_seller', 'retail_seller', 'wholesale_seller'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }

    // Get user from token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = payload.userId as string;

    // Handle Paid Upgrades via Stripe
    if (role === 'retail_seller' || role === 'wholesale_seller') {
      const priceKey = role === 'retail_seller' ? 'retail_seller' : 'wholesale_seller';
      const amount = SUBSCRIPTION_PRICES[priceKey];

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${role.replace('_', ' ').toUpperCase()} Plan`,
                description: `Monthly subscription for ${role.replace('_', ' ')} features`,
              },
              unit_amount: amount,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?upgrade=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?upgrade=cancel`,
        metadata: {
          userId,
          newRole: role,
          storeName: storeName || '',
          type: 'seller_upgrade'
        },
        customer_email: payload.email as string,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // Handle Free/Personal Upgrade Immediately
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role as UserRole,
        sellerDetails: {
          upsert: {
            create: {
              plan: SellerPlan.free,
              companyName: storeName || undefined,
              activeListings: 0,
            },
            update: {
              plan: SellerPlan.free,
              companyName: storeName || undefined,
            },
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'Account upgraded successfully' 
    });

  } catch (error: unknown) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
